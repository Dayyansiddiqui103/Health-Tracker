"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="theme-card border-b sticky top-0 z-30 px-6 py-3.5 transition-colors backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Clean Modern Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
            style={{
              backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
              border: "1px solid #007991",
            }}
          >
            {/* Minimalist Health Pulse SVG Logo */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C12 3 6 10 6 15C6 18.314 8.686 21 12 21C15.314 21 18 18.314 18 15C18 10 12 3 12 3Z"
                fill="#007991"
                fillOpacity="0.2"
                stroke="#007991"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 15.5H10.5L11.5 13L13 17.5L14 14.5L15 15.5H16"
                stroke="#97EFE9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h1
              className="text-base md:text-lg font-bold tracking-tight leading-tight"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              Student Health Tracker
            </h1>
            <p className="text-[11px]" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Daily habits & wellness
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          type="button"
          className="p-2 rounded-xl border transition-all hover:opacity-85 cursor-pointer"
          style={{
            backgroundColor: isDarkMode ? "#222E50" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
            color: isDarkMode ? "#97EFE9" : "#222E50",
          }}
          title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-[#97EFE9]" />
          ) : (
            <Moon className="w-4 h-4 text-[#222E50]" />
          )}
        </button>
      </div>
    </header>
  );
};
