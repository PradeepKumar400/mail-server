import React, { useEffect, useState } from "react";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Spam = () => {
  const { theme } = useTheme();

  const [spamEmails, setSpamEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH SPAM ---------------- */
  useEffect(() => {
    fetchSpam();
  }, []);

  const fetchSpam = async () => {
    try {
      setLoading(true);

      // 🔹 Backend-ready
      // const res = await mailAPI.getSpam();
      // if (res.data?.success) setSpamEmails(res.data.data.emails || []);

      // TEMP fallback
      setSpamEmails([]);
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
            🚫 Spam
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({spamEmails.length})
            </span>
          </h2>
        </div>

        {/* EMPTY STATE */}
        {spamEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-6xl mb-4">🚫</span>
            <p
              className="text-lg font-medium mb-1"
              style={{ color: theme.text }}
            >
              No spam emails
            </p>
            <p style={{ color: theme.subText }}>
              Spam emails will automatically appear here
            </p>
          </div>
        ) : (
          <EmailList
            emails={spamEmails}
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

export default Spam;
