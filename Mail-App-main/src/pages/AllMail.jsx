import React, { useEffect, useState } from "react";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const AllMail = () => {
  const { theme } = useTheme();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI-only filter dropdown states
  const [showTime, setShowTime] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => {
    fetchAllMail();
  }, []);

  /* ---------------- FETCH ALL MAIL ---------------- */
  const fetchAllMail = async () => {
    try {
      setLoading(true);
      setError("");

      // Backend-ready
      const res = await mailAPI.getInbox(100);
      if (res.data?.success) {
        setEmails(res.data.data.emails || []);
      }
    } catch (err) {
      console.error("Failed to fetch all mail:", err);
      setError("Failed to load mail");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = (uid) => {
    setEmails((prev) => prev.filter((e) => e.uid !== uid));
    setSelectedEmail(null);
  };

  const handleStar = (uid) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.uid === uid ? { ...e, starred: !e.starred } : e
      )
    );
  };

  const handleArchive = (uid) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.uid === uid ? { ...e, folder: "archive" } : e
      )
    );
    setSelectedEmail(null);
  };

  /* ---------------- FILTERED VIEW ---------------- */
  const visibleEmails = emails.filter(
    (e) => e.folder !== "trash"
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: theme.bg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.accent }}
          />
          <p style={{ color: theme.subText }}>Loading mail…</p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: theme.bg }}
      >
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchAllMail}
            className="px-4 py-2 rounded text-white"
            style={{ background: theme.accent }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* LEFT — LIST */}
      <div
        className={`transition-all duration-300
          ${selectedEmail ? "hidden lg:block lg:w-2/5" : "w-full"}
          border-r`}
        style={{
          background: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* HEADER */}
        <div className="p-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 text-sm font-medium rounded-full text-white"
              style={{ background: theme.accent }}
            >
              All Mail ({visibleEmails.length})
            </span>

            {/* UI-only filters */}
            <FilterButton label="From" open={showFrom} setOpen={setShowFrom} />
            <FilterButton label="To" open={showTo} setOpen={setShowTo} />
            <FilterButton label="Any time" open={showTime} setOpen={setShowTime} />
          </div>
        </div>

        {/* EMAIL LIST */}
        <div className="h-full overflow-y-auto">
          {visibleEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-5xl mb-3">📭</span>
              <p style={{ color: theme.subText }}>No emails found</p>
            </div>
          ) : (
            <EmailList
              emails={visibleEmails}
              selectedEmailId={selectedEmail?.uid}
              onSelectEmail={setSelectedEmail}
              onDelete={handleDelete}
              onStar={handleStar}
              onArchive={handleArchive}
            />
          )}
        </div>
      </div>

      {/* RIGHT — DETAILS */}
      <div
        className={`flex-1 transition-all duration-300
          ${selectedEmail ? "block" : "hidden lg:block"}`}
        style={{ background: theme.bg }}
      >
        <EmailDetails
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onDelete={handleDelete}
          onStar={handleStar}
          onArchive={handleArchive}
        />
      </div>
    </div>
  );
};

/* ---------------- FILTER BUTTON ---------------- */
const FilterButton = ({ label, open, setOpen }) => (
  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className="px-3 py-1 border rounded-full text-sm bg-white"
    >
      {label} ▾
    </button>

    {open && (
      <div className="absolute mt-2 w-56 bg-white shadow rounded p-3 z-10 text-sm">
        <p className="text-gray-500">Filter UI only</p>
      </div>
    )}
  </div>
);

export default AllMail;
