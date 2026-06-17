import React, { useEffect, useState } from "react";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Starred = () => {
  const { theme } = useTheme();

  const [starredEmails, setStarredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH STARRED ---------------- */
  useEffect(() => {
    fetchStarred();
  }, []);

  const fetchStarred = async () => {
    try {
      setLoading(true);

      // 🔹 Backend-ready
      // const res = await mailAPI.getStarred();
      // if (res.data?.success) setStarredEmails(res.data.data.emails || []);

      // TEMP fallback
      setStarredEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
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
          className="p-4 border-b"
          style={{ borderColor: theme.border }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.text }}
          >
            ⭐ Starred
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({starredEmails.length})
            </span>
          </h2>
        </div>

        {/* EMPTY STATE */}
        {starredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-6xl mb-4">⭐</span>
            <p
              className="text-lg font-medium mb-1"
              style={{ color: theme.text }}
            >
              No starred emails
            </p>
            <p style={{ color: theme.subText }}>
              Star important emails to find them quickly
            </p>
          </div>
        ) : (
          <EmailList
            emails={starredEmails}
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

export default Starred;
