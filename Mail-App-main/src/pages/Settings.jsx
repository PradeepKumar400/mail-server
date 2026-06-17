import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSettings,
  MdColorLens,
  MdSecurity,
  MdEmail,
} from "react-icons/md";
import { emailAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, changeTheme, currentThemeName } = useTheme();

  const [activeTab, setActiveTab] = useState("accounts");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateEmail, setShowCreateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState({ emailName: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- FETCH EMAIL ACCOUNTS ---------------- */
  useEffect(() => {
    if (activeTab === "accounts") {
      fetchEmails();
    }
  }, [activeTab]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await emailAPI.listEmails();
      if (res.data?.success) {
        setEmails(res.data.data || []);
      }
    } catch {
      setError("Failed to load email accounts");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE EMAIL ---------------- */
  const handleCreateEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newEmail.emailName) {
      setError("Email name is required");
      return;
    }
    if (!newEmail.password || newEmail.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await emailAPI.createEmail({
        emailName: newEmail.emailName.toLowerCase(),
        password: newEmail.password,
      });

      if (res.data?.success) {
        setSuccess(`Email created: ${res.data.data.email}`);
        setNewEmail({ emailName: "", password: "" });
        setShowCreateEmail(false);
        fetchEmails();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create email");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SET PRIMARY ---------------- */
  const handleSetPrimary = async (emailId) => {
    try {
      const res = await emailAPI.setPrimary(emailId);
      if (res.data?.success) {
        setSuccess("Primary email updated");
        fetchEmails();
      }
    } catch {
      setError("Failed to update primary email");
    }
  };

  return (
    <div className="flex h-screen" style={{ background: theme.bg }}>
      {/* LEFT SIDEBAR */}
      <aside
        className="w-64 border-r p-4 flex flex-col gap-2"
        style={{ background: theme.cardBg, borderColor: theme.border }}
      >
        <button
          onClick={() => navigate("/inbox")}
          className="text-sm mb-3 hover:underline"
          style={{ color: theme.accent }}
        >
          ← Back to Inbox
        </button>

        <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
          Settings
        </h2>

        <SideTab
          icon={<MdEmail />}
          label="Email Accounts"
          active={activeTab === "accounts"}
          onClick={() => setActiveTab("accounts")}
          theme={theme}
        />

        <SideTab
          icon={<MdSettings />}
          label="Account"
          active={activeTab === "account"}
          onClick={() => setActiveTab("account")}
          theme={theme}
        />

        <SideTab
          icon={<MdColorLens />}
          label="Appearance"
          active={activeTab === "appearance"}
          onClick={() => setActiveTab("appearance")}
          theme={theme}
        />

        <SideTab
          icon={<MdSecurity />}
          label="Security"
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
          theme={theme}
        />
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ALERTS */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700">
            {success}
          </div>
        )}

        {/* EMAIL ACCOUNTS */}
        {activeTab === "accounts" && (
          <Section title="Email Accounts" theme={theme}>
            <div className="flex justify-between mb-4">
              <p style={{ color: theme.subText }}>
                Manage multiple email addresses
              </p>
              <button
                onClick={() => setShowCreateEmail(true)}
                className="px-4 py-2 rounded text-white"
                style={{ background: theme.accent }}
              >
                ➕ Add Email
              </button>
            </div>

            {showCreateEmail && (
              <form
                onSubmit={handleCreateEmail}
                className="mb-6 p-4 rounded border"
                style={{ borderColor: theme.border }}
              >
                <input
                  placeholder="Email name"
                  value={newEmail.emailName}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, emailName: e.target.value })
                  }
                  className="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newEmail.password}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, password: e.target.value })
                  }
                  className="w-full mb-3 p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded text-white"
                    style={{ background: theme.accent }}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateEmail(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p>Loading…</p>
            ) : emails.length === 0 ? (
              <p>No email accounts found</p>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  className="flex justify-between items-center p-4 mb-2 rounded border"
                  style={{ borderColor: theme.border }}
                >
                  <div>
                    <p style={{ color: theme.text }}>{email.email}</p>
                    <p style={{ color: theme.subText }} className="text-sm">
                      {email.isPrimary ? "⭐ Primary" : "Secondary"}
                    </p>
                  </div>
                  {!email.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(email.id)}
                      className="text-sm underline"
                      style={{ color: theme.accent }}
                    >
                      Set Primary
                    </button>
                  )}
                </div>
              ))
            )}
          </Section>
        )}

        {/* ACCOUNT */}
        {activeTab === "account" && (
          <Section title="Account" theme={theme}>
            <Field label="Username" value={user?.username} />
            <Field label="Primary Email" value={user?.email} />
          </Section>
        )}

        {/* APPEARANCE */}
        {activeTab === "appearance" && (
          <Section title="Appearance" theme={theme}>
            <div className="grid grid-cols-3 gap-4">
              {["Classic", "Dark", "Nature", "Ocean", "Sunset", "Minimal"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => changeTheme(t)}
                    className={`p-4 rounded border ${
                      currentThemeName === t ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </Section>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <Section title="Security" theme={theme}>
            <button
              className="underline"
              style={{ color: theme.accent }}
            >
              Change Password
            </button>
          </Section>
        )}
      </main>
    </div>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */

const SideTab = ({ icon, label, active, onClick, theme }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded transition"
    style={{
      background: active ? theme.bg : "transparent",
      color: active ? theme.accent : theme.subText,
    }}
  >
    {icon} {label}
  </button>
);

const Section = ({ title, children, theme }) => (
  <div
    className="max-w-3xl p-6 rounded shadow-sm"
    style={{ background: theme.cardBg, color: theme.text }}
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      disabled
      value={value || ""}
      className="w-full p-2 border rounded bg-gray-50"
    />
  </div>
);

export default Settings;
