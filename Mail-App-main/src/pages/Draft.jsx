import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Draft = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DRAFTS ---------------- */
  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);

      // 🔹 Backend-ready
      // const res = await mailAPI.getDrafts();
      // if (res.data?.success) setDrafts(res.data.data.drafts || []);

      // TEMP fallback
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft) => {
    setSelectedDraft(draft);
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
          ${selectedDraft ? "hidden lg:block lg:w-2/5" : "w-full"}
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
            Drafts
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: theme.subText }}
            >
              ({drafts.length})
            </span>
          </h2>
        </div>

        {/* EMPTY STATE */}
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-6xl mb-4">📝</span>
            <p
              className="text-lg font-medium mb-1"
              style={{ color: theme.text }}
            >
              No drafts
            </p>
            <p className="mb-4" style={{ color: theme.subText }}>
              Draft emails you save will appear here
            </p>
            <button
              onClick={() => navigate("/compose")}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: theme.accent }}
            >
              Compose Email
            </button>
          </div>
        ) : (
          <EmailList
            emails={drafts}
            selectedEmail={selectedDraft}
            onSelectEmail={handleSelectDraft}
          />
        )}
      </div>

      {/* RIGHT — DETAILS */}
      <div
        className={`flex-1 transition-all duration-300
          ${selectedDraft ? "block" : "hidden lg:block"}`}
        style={{ backgroundColor: theme.bg }}
      >
        <EmailDetails
          email={selectedDraft}
          onBack={() => setSelectedDraft(null)}
          onReply={(draft) =>
            navigate("/compose", {
              state: {
                draft,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default Draft;
