"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header
      className="sticky top-0 z-30 px-6 py-4 shadow-md transition-colors"
      style={{
        background: "linear-gradient(135deg, #222E50 0%, #007991 100%)",
        borderBottom: "2px solid #97EFE9",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Colorful Palette Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105 shrink-0"
            style={{
              width: "40px",
              height: "40px",
              minWidth: "40px",
              minHeight: "40px",
              backgroundColor: "#97EFE9",
              border: "2px solid #FFFFFF",
            }}
          >
            {/* Health Pulse SVG Logo in Palette #222E50 & #007991 */}
            <svg
              className="w-6 h-6"
              width="24"
              height="24"
              style={{ width: "24px", height: "24px" }}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C12 3 6 10 6 15C6 18.314 8.686 21 12 21C15.314 21 18 18.314 18 15C18 10 12 3 12 3Z"
                fill="#007991"
                fillOpacity="0.3"
                stroke="#007991"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 15.5H10.5L11.5 13L13 17.5L14 14.5L15 15.5H16"
                stroke="#222E50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                Student Health Tracker
              </h1>
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
              >
                Daily
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: "#97EFE9" }}>
              Hydration, restorative rest & fitness companion
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          type="button"
          className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer flex items-center gap-2"
          style={{
            backgroundColor: "#222E50",
            border: "1.5px solid #97EFE9",
            color: "#97EFE9",
          }}
          title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-[#97EFE9]" />
              <span className="text-xs font-bold text-white hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#97EFE9]" />
              <span className="text-xs font-bold text-white hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
