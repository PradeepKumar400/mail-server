import React, { useEffect, useState } from "react";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Outbox = () => {
  const { theme } = useTheme();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOutbox();
  }, []);

  /* ---------------- FETCH OUTBOX ---------------- */
  const fetchOutbox = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔹 Backend-ready (replace when endpoint exists)
      // const res = await mailAPI.getOutbox();
      // if (res.data?.success) setEmails(res.data.data.emails || []);

      // TEMP safe fallback
      setEmails([]);
    } catch (err) {
      console.error("Failed to fetch outbox:", err);
      setError("Failed to load outbox");
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
          <p style={{ color: theme.subText }}>Loading outbox…</p>
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
            onClick={fetchOutbox}
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
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.text }}
          >
            📤 Outbox
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({emails.length})
            </span>
          </h2>
        </div>

        {/* LIST / EMPTY */}
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-5xl mb-3">📭</span>
            <p style={{ color: theme.subText }}>Outbox is empty</p>
            <p className="text-sm" style={{ color: theme.subText }}>
              Emails waiting to be sent will appear here
            </p>
          </div>
        ) : (
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmail?.uid}
            onSelectEmail={setSelectedEmail}
            onDelete={handleDelete}
            onStar={handleStar}
            onArchive={handleArchive}
          />
        )}
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

export default Outbox;
