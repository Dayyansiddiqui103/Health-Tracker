"use client";

import React from "react";
import { Sun, Moon, CalendarDays, Droplets, CheckSquare, BarChart3 } from "lucide-react";

export type TabType = "planner" | "trackers" | "checklist" | "summary";

interface HeaderProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  completionRate: number;
  pendingTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  isDarkMode,
  onToggleTheme,
  completionRate,
  pendingTasksCount,
}) => {
  const tabs = [
    { id: "planner" as TabType, label: "Daily Planner", icon: CalendarDays },
    { id: "trackers" as TabType, label: "Health Trackers", icon: Droplets },
    { id: "checklist" as TabType, label: "Daily Checklist", icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined },
    { id: "summary" as TabType, label: "Overview & Score", icon: BarChart3, badge: `${completionRate}%` },
  ];

  return (
    <header className="theme-card border-b sticky top-0 z-30 px-4 md:px-8 py-3.5 transition-colors backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Improved Custom Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #007991 0%, #222E50 100%)",
              border: "1.5px solid #97EFE9",
            }}
          >
            {/* Custom Student Health Pulse Logo SVG */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer soft glow droplet leaf */}
              <path
                d="M12 2.5C12 2.5 5 10.5 5 15.5C5 19.366 8.134 22.5 12 22.5C15.866 22.5 19 19.366 19 15.5C19 10.5 12 2.5 12 2.5Z"
                fill="#007991"
                fillOpacity="0.4"
                stroke="#97EFE9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner energetic health pulse line */}
              <path
                d="M7 16H9.5L11 12L13 18L14.5 14.5L15.5 16H17"
                stroke="#97EFE9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="7" r="1.2" fill="#97EFE9" />
            </svg>
          </div>
          <div>
            <h1
              className="text-lg md:text-xl font-extrabold tracking-tight"
              style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
            >
              Student Health Tracker
            </h1>
            <p
              className="text-xs"
              style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}
            >
              Daily wellness, hydration & rest made simple
            </p>
          </div>
        </div>

        {/* Tab Navigation & Theme Switcher */}
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sleek Tab Bar */}
          <nav
            className="flex items-center p-1 rounded-2xl border transition-all overflow-x-auto w-full md:w-auto"
            style={{
              backgroundColor: isDarkMode ? "#1A233D" : "#E8F8F7",
              borderColor: isDarkMode ? "#2F3E68" : "#CBEFEE",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive ? "shadow-sm scale-[1.02]" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: isActive ? "#007991" : "transparent",
                    color: isActive ? "#FFFFFF" : isDarkMode ? "#97EFE9" : "#222E50",
                  }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#97EFE9]" : ""}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5"
                      style={{
                        backgroundColor: isActive ? "#97EFE9" : "#007991",
                        color: isActive ? "#222E50" : "#FFFFFF",
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            type="button"
            className="p-2.5 rounded-xl transition-all hover:scale-105 border flex-shrink-0 cursor-pointer"
            style={{
              backgroundColor: isDarkMode ? "#222E50" : "#97EFE9",
              borderColor: "#007991",
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
      </div>
    </header>
  );
};
