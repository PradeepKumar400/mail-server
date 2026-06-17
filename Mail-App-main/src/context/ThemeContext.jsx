import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const ThemeContext = createContext();

export const themes = {
  Classic: {
    mode: "light",
    bg: "#E9F4FF",
    sidebarBg: "#E9F4FF",
    sidebarText: "#1956AC",
    cardBg: "#FFFFFF",
    text: "#1f2937",
    subText: "#4b5563",
    border: "#e5e7eb",
    accent: "#1956AC",
  },
  Dark: {
    mode: "dark",
    bg: "#111827",
    sidebarBg: "#1f2937",
    sidebarText: "#93C5FD",
    cardBg: "#1f2937",
    text: "#F9FAFB",
    subText: "#D1D5DB",
    border: "#374151",
    accent: "#3B82F6",
  },
  Nature: {
    mode: "light",
    bg: "#F1F8E9",
    sidebarBg: "#F1F8E9",
    sidebarText: "#33691E",
    cardBg: "#FFFFFF",
    text: "#1B5E20",
    subText: "#558B2F",
    border: "#C5E1A5",
    accent: "#558B2F",
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState("Classic");

  // Load theme on first mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeName(savedTheme);
    }
  }, []);

  // Sync theme changes
  useEffect(() => {
    const theme = themes[currentThemeName];
    localStorage.setItem("theme", currentThemeName);

    // Tailwind dark mode sync
    document.documentElement.classList.toggle(
      "dark",
      theme.mode === "dark"
    );
  }, [currentThemeName]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[currentThemeName],
        currentThemeName,
        changeTheme,
        themeNames: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
