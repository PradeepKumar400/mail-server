import React, { useEffect, useState } from "react";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Trash = () => {
  const { theme } = useTheme();

  const [trashedEmails, setTrashedEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH TRASH ---------------- */
  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);

      // 🔹 Backend-ready
      // const res = await mailAPI.getTrash();
      // if (res.data?.success) setTrashedEmails(res.data.data.emails || []);

      // TEMP fallback
      setTrashedEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleEmptyTrash = () => {
    if (window.confirm("Permanently delete all emails in Trash?")) {
      // 🔹 Backend-ready
      // await mailAPI.emptyTrash();
      setTrashedEmails([]);
      setSelectedEmail(null);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: theme.accent }}
        />
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
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
      >
        {/* HEADER */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: theme.border }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.text }}
          >
            🗑️ Trash
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({trashedEmails.length})
            </span>
          </h2>

          {trashedEmails.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="text-sm text-red-600 hover:underline"
            >
              Empty Trash
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {trashedEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-6xl mb-4">🗑️</span>
            <p
              className="text-lg font-medium mb-1"
              style={{ color: theme.text }}
            >
              Trash is empty
            </p>
            <p style={{ color: theme.subText }}>
              Deleted emails stay here for 30 days
            </p>
          </div>
        ) : (
          <EmailList
            emails={trashedEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
          />
        )}
      </div>

      {/* RIGHT — DETAILS */}
      <div
        className={`flex-1 transition-all duration-300
          ${selectedEmail ? "block" : "hidden lg:block"}`}
        style={{ backgroundColor: theme.bg }}
      >
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
        />
      </div>
    </div>
  );
};

export default Trash;
