"use client";

import React from "react";
import { CalendarDays, Droplets, CheckSquare, BarChart3 } from "lucide-react";

export type TabType = "planner" | "trackers" | "checklist" | "summary";

interface TabsNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isDarkMode: boolean;
  completionRate: number;
  pendingTasksCount: number;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onChangeTab,
  isDarkMode,
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
    <div className="flex justify-center my-6 px-4">
      <nav
        className="inline-flex items-center p-1.5 rounded-2xl border transition-all overflow-x-auto shadow-xs"
        style={{
          backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
          borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
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
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive ? "shadow-xs" : "hover:opacity-75"
              }`}
              style={{
                backgroundColor: isActive ? "#007991" : "transparent",
                color: isActive ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
              }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#97EFE9]" : ""}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1"
                  style={{
                    backgroundColor: isActive ? "#222E50" : isDarkMode ? "#222E50" : "#F1F5F8",
                    color: isActive ? "#97EFE9" : isDarkMode ? "#8699B8" : "#4A5B7D",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
