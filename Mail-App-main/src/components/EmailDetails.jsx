import React from "react";
import { MdArchive, MdDelete, MdStar } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

const EmailDetails = ({
  email,
  onBack,
  onReply,
  onDelete,
  onStar,
  onArchive,
}) => {
  const { theme } = useTheme();

  if (!email) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: theme.bg, color: theme.subText }}
      >
        <div className="text-center">
          <span className="text-5xl block mb-3">📨</span>
          <p>Select an email to read</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ backgroundColor: theme.bg }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: theme.border }}
      >
        <button
          onClick={onBack}
          className="lg:hidden px-2 py-1 rounded hover:opacity-80"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStar?.(email.uid)}
            className="p-2 rounded hover:opacity-80"
            title="Star"
          >
            <MdStar
              size={20}
              style={{
                color: email.starred ? "#facc15" : theme.subText,
              }}
            />
          </button>

          <button
            onClick={() => onArchive?.(email.uid)}
            className="p-2 rounded hover:opacity-80"
            title="Archive"
          >
            <MdArchive size={20} style={{ color: theme.subText }} />
          </button>

          <button
            onClick={() => {
              onDelete?.(email.uid);
              onBack?.();
            }}
            className="p-2 rounded hover:opacity-80"
            title="Delete"
          >
            <MdDelete size={20} style={{ color: theme.subText }} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* SUBJECT */}
        <h1
          className="text-2xl font-semibold mb-4"
          style={{ color: theme.text }}
        >
          {email.subject || "(No Subject)"}
        </h1>

        {/* SENDER INFO */}
        <div
          className="flex items-start justify-between pb-4 mb-6 border-b"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-start gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
              style={{ backgroundColor: theme.accent }}
            >
              {email.from?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p style={{ color: theme.text }} className="font-medium">
                {email.from}
              </p>
              <p className="text-sm" style={{ color: theme.subText }}>
                to {email.to}
              </p>
            </div>
          </div>

          <span className="text-sm" style={{ color: theme.subText }}>
           {email.sentDate ? formatDate(email.sentDate) : ""}
                  
          </span>
        </div>

        {/* BODY */}
        <div className="max-w-none">
          {email.htmlBody ? (
            <div
              className="prose max-w-none"
              style={{ color: theme.text }}
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          ) : (
            <p
              className="whitespace-pre-wrap leading-relaxed"
              style={{ color: theme.text }}
            >
              {email.body}
            </p>
          )}
        </div>

        {/* ATTACHMENTS */}
        {email.attachments?.length > 0 && (
          <div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: theme.cardBg }}
          >
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: theme.text }}
            >
              Attachments
            </p>

            <div className="space-y-2">
              {email.attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded"
                  style={{
                    backgroundColor: theme.bg,
                    color: theme.text,
                  }}
                >
                  <span className="text-sm">📎 {file}</span>
                  <button
                    className="text-sm hover:underline"
                    style={{ color: theme.accent }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div
        className="flex gap-2 p-4 border-t"
        style={{ borderColor: theme.border }}
      >
        <button
          onClick={() => onReply?.(email)}
          className="flex-1 py-2 rounded-lg text-white font-medium hover:opacity-90"
          style={{ backgroundColor: theme.accent }}
        >
          ↩️ Reply
        </button>

        <button
          className="flex-1 py-2 rounded-lg border hover:opacity-80"
          style={{
            borderColor: theme.border,
            color: theme.text,
          }}
        >
          ↪️ Forward
        </button>
      </div>
    </div>
  );
};

export default EmailDetails;
