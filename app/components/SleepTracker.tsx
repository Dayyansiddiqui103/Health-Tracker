"use client";

import React from "react";
import { SleepLog } from "../types";
import { Moon, Clock, Bed, Sparkles, RotateCcw } from "lucide-react";

interface SleepTrackerProps {
  sleep: SleepLog;
  goalHours: number | "";
  onUpdateSleep: (sleep: SleepLog) => void;
  isDarkMode: boolean;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({
  sleep,
  goalHours,
  onUpdateSleep,
  isDarkMode,
}) => {
  const target = typeof goalHours === "number" && goalHours > 0 ? goalHours : 8;
  const currentHours = typeof sleep.hours === "number" ? sleep.hours : 0;
  const progressPercent = Math.min(100, Math.round((currentHours / target) * 100));

  const handleReset = () => {
    onUpdateSleep({
      hours: "",
      bedTime: "",
      wakeTime: "",
      quality: "",
      notes: "",
    });
  };

  const qualityOptions: Array<SleepLog["quality"]> = ["Excellent", "Good", "Fair", "Restless"];

  return (
    <div className="theme-card rounded-2xl p-6 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
                border: "1px solid #007991",
              }}
            >
              <Moon className="w-4 h-4 text-[#007991]" />
            </div>
            <div>
              <h3
                className="text-base font-bold tracking-tight"
                style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
              >
                Sleep Tracker
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
                Goal: {goalHours ? `${goalHours} hrs` : "Set in Planner"}
              </p>
            </div>
          </div>

          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
              color: isDarkMode ? "#97EFE9" : "#007991",
            }}
          >
            {sleep.hours !== "" ? `${sleep.hours} hrs logged` : "Not logged"}
          </span>
        </div>

        {/* Manual Hours Input & Quick Steppers */}
        <div className="mt-5">
          <label
            htmlFor="sleep-hours-input"
            className="text-xs font-bold uppercase tracking-wider block mb-1.5"
            style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
          >
            Hours Slept (Manual Input)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="sleep-hours-input"
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="e.g. 7.5"
                value={sleep.hours === "" ? "" : sleep.hours}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                  onUpdateSleep({ ...sleep, hours: val });
                }}
                className="w-full text-base font-bold px-3.5 py-2 rounded-xl border focus-ring"
                style={{
                  backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                  color: isDarkMode ? "#F8FAFC" : "#222E50",
                }}
              />
              <span
                className="absolute right-3.5 top-2.5 text-xs font-medium pointer-events-none"
                style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}
              >
                hrs
              </span>
            </div>

            {/* Quick quick buttons */}
            {[6, 7, 8, 9].map((hr) => (
              <button
                key={hr}
                type="button"
                onClick={() => onUpdateSleep({ ...sleep, hours: hr })}
                className="px-3 py-2 text-xs font-semibold rounded-xl border transition-all hover:opacity-85 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: sleep.hours === hr ? "#007991" : "transparent",
                  borderColor: sleep.hours === hr ? "#007991" : isDarkMode ? "#27375A" : "#E2E8F0",
                  color: sleep.hours === hr ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
                }}
              >
                {hr}h
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar vs Goal */}
        <div className="mt-4">
          <div
            className="flex justify-between text-xs mb-1 font-medium"
            style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}
          >
            <span>Goal: {target} hours</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: isDarkMode ? "#0F172A" : "#E2E8F0" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#007991",
              }}
            />
          </div>
        </div>

        {/* Bedtime & Wake Time Inputs */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label
              htmlFor="bedtime-input"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1"
              style={{ color: isDarkMode ? "#8699B8" : "#4A5B7D" }}
            >
              <Bed className="w-3.5 h-3.5 text-[#007991]" />
              Bedtime
            </label>
            <input
              id="bedtime-input"
              type="time"
              value={sleep.bedTime}
              onChange={(e) => onUpdateSleep({ ...sleep, bedTime: e.target.value })}
              className="w-full text-xs px-3 py-1.5 rounded-xl border focus-ring"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                color: isDarkMode ? "#F8FAFC" : "#222E50",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="waketime-input"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1"
              style={{ color: isDarkMode ? "#8699B8" : "#4A5B7D" }}
            >
              <Clock className="w-3.5 h-3.5 text-[#007991]" />
              Wake Time
            </label>
            <input
              id="waketime-input"
              type="time"
              value={sleep.wakeTime}
              onChange={(e) => onUpdateSleep({ ...sleep, wakeTime: e.target.value })}
              className="w-full text-xs px-3 py-1.5 rounded-xl border focus-ring"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                color: isDarkMode ? "#F8FAFC" : "#222E50",
              }}
            />
          </div>
        </div>

        {/* Sleep Quality Selector */}
        <div className="mt-4">
          <label
            className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1"
            style={{ color: isDarkMode ? "#8699B8" : "#4A5B7D" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#007991]" />
            Sleep Quality Rating
          </label>
          <div className="grid grid-cols-4 gap-2">
            {qualityOptions.map((opt) => {
              const isSelected = sleep.quality === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateSleep({ ...sleep, quality: isSelected ? "" : opt })}
                  className="py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center hover:opacity-85 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? "#007991" : "transparent",
                    borderColor: isSelected ? "#007991" : isDarkMode ? "#27375A" : "#E2E8F0",
                    color: isSelected ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Reset */}
      <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
        <span style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
          Blank initial state
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 font-medium hover:opacity-75 transition-opacity cursor-pointer"
          style={{ color: "#007991" }}
        >
          <RotateCcw className="w-3 h-3 text-[#007991]" />
          Clear Sleep
        </button>
      </div>
    </div>
  );
};
