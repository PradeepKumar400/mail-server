import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../Data/constants";
import { useTheme } from "../context/ThemeContext";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <aside
      className="w-64 h-screen sticky top-16 overflow-y-auto border-r"
      style={{
        backgroundColor: theme.sidebarBg,
        borderColor: theme.border,
        color: theme.sidebarText,
      }}
    >
      {/* COMPOSE */}
      <div className="p-4">
        <button
          onClick={() => navigate("/compose")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold shadow-md transition hover:opacity-90"
          style={{
            backgroundColor: theme.accent,
            color: "#ffffff",
          }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Compose
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="px-2 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition"
              style={{
                backgroundColor: isActive
                  ? `${theme.accent}22`
                  : "transparent",
                color: isActive ? theme.accent : theme.sidebarText,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </div>

              {item.count > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.accent,
                    color: "#fff",
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* STORAGE */}
      <div className="p-4 mt-auto">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: theme.cardBg }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-xs" style={{ color: theme.subText }}>
              Storage
            </span>
            <span className="text-xs font-semibold" style={{ color: theme.text }}>
              2.5 GB / 15 GB
            </span>
          </div>

          <div
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: theme.border }}
          >
            <div
              className="h-2 rounded-full"
              style={{
                width: "16.6%",
                backgroundColor: theme.accent,
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
