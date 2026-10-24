"use client";

import React from "react";
import { CalendarDays, Droplets, CheckSquare, BarChart3, Bot } from "lucide-react";

export type TabType = "planner" | "trackers" | "checklist" | "summary" | "ai-coach";

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
  completionRate,
  pendingTasksCount,
}) => {
  const tabs = [
    { id: "planner" as TabType, label: "Daily Planner", icon: CalendarDays },
    { id: "trackers" as TabType, label: "Health Trackers", icon: Droplets },
    { id: "checklist" as TabType, label: "Daily Checklist", icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined },
    { id: "summary" as TabType, label: "Overview & Score", icon: BarChart3, badge: `${completionRate}%` },
    { id: "ai-coach" as TabType, label: "AI Health Coach", icon: Bot, badge: "AI" },
  ];

  return (
    <div className="flex justify-center my-6 px-4">
      <nav
        className="inline-flex items-center p-1.5 rounded-2xl border transition-all overflow-x-auto shadow-md"
        style={{
          backgroundColor: "#222E50",
          borderColor: "#007991",
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
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive ? "shadow-sm scale-[1.02]" : "hover:text-[#97EFE9]"
              }`}
              style={{
                backgroundColor: isActive ? "#97EFE9" : "transparent",
                color: isActive ? "#222E50" : "#FFFFFF",
              }}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#222E50]" : "text-[#97EFE9]"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-extrabold ml-1"
                  style={{
                    backgroundColor: isActive ? "#007991" : "#007991",
                    color: isActive ? "#97EFE9" : "#FFFFFF",
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
