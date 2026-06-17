import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mailAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const ComposePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  /* ---------------- PREFILL ON REPLY ---------------- */
  useEffect(() => {
    if (location.state?.replyTo) {
      setFormData((prev) => ({
        ...prev,
        to: location.state.replyTo,
        subject: location.state.subject || "",
        body: location.state.originalBody
          ? `\n\n--- Original Message ---\n${location.state.originalBody}`
          : "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  /* ---------------- SEND EMAIL ---------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.to) {
      setError("Recipient email is required");
      return;
    }

    if (!formData.subject) {
      setError("Subject is required");
      return;
    }

    try {
      setSending(true);

      const payload = {
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
      };

      if (formData.cc) payload.cc = formData.cc;
      if (formData.bcc) payload.bcc = formData.bcc;

      const response = await mailAPI.send(payload);

      if (response.data?.success) {
        setSuccess("Email sent successfully");
        setTimeout(() => navigate("/inbox"), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard this email?")) {
      navigate("/inbox");
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: theme.cardBg }}
        >
          {/* HEADER */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: theme.border }}
          >
            <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
              New Message
            </h2>
            <button
              onClick={() => navigate("/inbox")}
              className="p-2 rounded hover:opacity-70"
            >
              ✕
            </button>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="mx-4 mt-4 p-3 rounded bg-red-50 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mx-4 mt-4 p-3 rounded bg-green-50 text-green-700">
              {success}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSend} className="p-4">
            {/* TO */}
            <Field
              label="To"
              name="to"
              value={formData.to}
              onChange={handleChange}
              extra={
                <>
                  <button
                    type="button"
                    onClick={() => setShowCc((v) => !v)}
                    className="text-sm"
                    style={{ color: theme.accent }}
                  >
                    Cc
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBcc((v) => !v)}
                    className="text-sm"
                    style={{ color: theme.accent }}
                  >
                    Bcc
                  </button>
                </>
              }
            />

            {showCc && (
              <Field
                label="Cc"
                name="cc"
                value={formData.cc}
                onChange={handleChange}
              />
            )}

            {showBcc && (
              <Field
                label="Bcc"
                name="bcc"
                value={formData.bcc}
                onChange={handleChange}
              />
            )}

            {/* SUBJECT */}
            <Field
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />

            {/* BODY */}
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={14}
              placeholder="Type your message…"
              className="w-full resize-none outline-none p-3 rounded mt-4"
              style={{
                backgroundColor: theme.bg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
            />

            {/* ACTIONS */}
            <div
              className="flex items-center justify-between mt-6 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2 rounded-lg text-white font-medium disabled:opacity-60"
                  style={{ backgroundColor: theme.accent }}
                >
                  {sending ? "Sending…" : "Send"} 📤
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:opacity-70"
                  title="Attach file"
                >
                  📎
                </button>
              </div>

              <button
                type="button"
                onClick={handleDiscard}
                className="text-red-600 hover:underline"
              >
                🗑 Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ---------------- FIELD COMPONENT ---------------- */
const Field = ({ label, name, value, onChange, extra }) => {
  return (
    <div className="flex items-center gap-2 border-b py-3">
      <span className="w-16 text-sm text-gray-500">{label}:</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent"
        placeholder={label}
      />
      {extra && <div className="flex gap-2">{extra}</div>}
    </div>
  );
};

export default ComposePage;
