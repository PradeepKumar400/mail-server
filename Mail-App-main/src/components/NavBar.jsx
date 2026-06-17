import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/bluechat_logo.webp";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    theme,
    currentThemeName,
    changeTheme,
  } = useTheme();

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    changeTheme(currentThemeName === "Dark" ? "Classic" : "Dark");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", searchQuery);
  };

  return (
    <nav
      className="border-b px-4 py-3 sticky top-0 z-50"
      style={{
        backgroundColor: theme.sidebarBg,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={logo}
            alt="Mail"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/inbox")}
          />

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mail"
                className="w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                }}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.subText }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* THEME TOGGLE */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full hover:opacity-80 transition"
            title="Toggle theme"
          >
            {currentThemeName === "Dark" ? "☀️" : "🌙"}
          </button>

          {/* NOTIFICATION */}
          <button className="p-2 rounded-full relative hover:opacity-80">
            🔔
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* USER */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:opacity-80"
            >
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: theme.accent }}
              >
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span
                className="text-sm font-medium hidden md:block"
                style={{ color: theme.text }}
              >
                {user?.email || "User"}
              </span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.subText }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border,
                }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: theme.border }}>
                  <p className="text-sm font-semibold" style={{ color: theme.text }}>
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs" style={{ color: theme.subText }}>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                  style={{ color: theme.text }}
                >
                  ⚙️ Settings
                </button>

                <button
                  onClick={() => navigate("/settings/emails")}
                  className="w-full text-left px-4 py-2 text-sm hover:opacity-80"
                  style={{ color: theme.text }}
                >
                  📧 Manage Emails
                </button>

                <div className="border-t my-1" style={{ borderColor: theme.border }} />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:opacity-80"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
