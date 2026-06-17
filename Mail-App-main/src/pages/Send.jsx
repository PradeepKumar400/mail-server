import React, { useEffect, useState } from "react";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Send = () => {
  const { theme } = useTheme();

  const [sentEmails, setSentEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSent();
  }, []);

  /* ---------------- FETCH SENT ---------------- */
  const fetchSent = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔹 Backend-ready (replace when API exists)
      // const res = await mailAPI.getSent();
      // if (res.data?.success) setSentEmails(res.data.data.emails || []);

      // TEMP fallback (safe)
      setSentEmails([]);
    } catch (err) {
      setError("Failed to load sent emails");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleDelete = (uid) => {
    setSentEmails((prev) => prev.filter((e) => e.uid !== uid));
    setSelectedEmail(null);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.accent }}
          />
          <p style={{ color: theme.subText }}>Loading sent mail…</p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchSent}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: theme.accent }}
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
            Sent
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({sentEmails.length})
            </span>
          </h2>
        </div>

        {sentEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-5xl mb-3">📭</span>
            <p style={{ color: theme.subText }}>No sent emails</p>
          </div>
        ) : (
          <EmailList
            emails={sentEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleSelectEmail}
            onDelete={handleDelete}
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
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Send;
