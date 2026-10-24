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
    <div
      className="rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg border"
      style={{
        background: "linear-gradient(145deg, #162038 0%, #222E50 100%)",
        borderColor: "#007991",
        boxShadow: "0 8px 30px rgba(34, 46, 80, 0.4)",
      }}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#007991]/30">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: "#007991", border: "1.5px solid #97EFE9" }}
            >
              <Moon className="w-5 h-5 text-[#97EFE9]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white">
                Sleep Tracker
              </h3>
              <p className="text-xs font-medium text-[#97EFE9]">
                Goal: {goalHours ? `${goalHours} hrs` : "Set in Planner"}
              </p>
            </div>
          </div>

          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{
              backgroundColor: "#007991",
              borderColor: "#97EFE9",
              color: "#FFFFFF",
            }}
          >
            {sleep.hours !== "" ? `${sleep.hours} hrs logged` : "Not logged"}
          </span>
        </div>

        {/* Manual Hours Input & Quick Steppers */}
        <div className="mt-5">
          <label
            htmlFor="sleep-hours-input"
            className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-[#97EFE9]"
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
                className="w-full text-base font-bold px-3.5 py-2.5 rounded-xl border focus-ring text-white"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
                }}
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-[#97EFE9] pointer-events-none">
                hrs
              </span>
            </div>

            {/* Quick buttons */}
            {[6, 7, 8, 9].map((hr) => (
              <button
                key={hr}
                type="button"
                onClick={() => onUpdateSleep({ ...sleep, hours: hr })}
                className="px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: sleep.hours === hr ? "#97EFE9" : "#007991",
                  borderColor: "#97EFE9",
                  color: sleep.hours === hr ? "#222E50" : "#FFFFFF",
                }}
              >
                {hr}h
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar vs Goal */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5 font-bold text-[#97EFE9]">
            <span>Goal: {target} hours</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden border border-[#007991]"
            style={{ backgroundColor: "#0D1424" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #007991 0%, #97EFE9 100%)",
              }}
            />
          </div>
        </div>

        {/* Bedtime & Wake Time Inputs */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label
              htmlFor="bedtime-input"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1 text-[#97EFE9]"
            >
              <Bed className="w-3.5 h-3.5 text-[#97EFE9]" />
              Bedtime
            </label>
            <input
              id="bedtime-input"
              type="time"
              value={sleep.bedTime}
              onChange={(e) => onUpdateSleep({ ...sleep, bedTime: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border focus-ring text-white font-medium"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="waketime-input"
              className="text-[11px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1 text-[#97EFE9]"
            >
              <Clock className="w-3.5 h-3.5 text-[#97EFE9]" />
              Wake Time
            </label>
            <input
              id="waketime-input"
              type="time"
              value={sleep.wakeTime}
              onChange={(e) => onUpdateSleep({ ...sleep, wakeTime: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border focus-ring text-white font-medium"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
              }}
            />
          </div>
        </div>

        {/* Sleep Quality Selector */}
        <div className="mt-4">
          <label className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 text-[#97EFE9]">
            <Sparkles className="w-3.5 h-3.5 text-[#97EFE9]" />
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
                  className="py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  style={{
                    backgroundColor: isSelected ? "#97EFE9" : "#0D1424",
                    borderColor: isSelected ? "#97EFE9" : "#007991",
                    color: isSelected ? "#222E50" : "#FFFFFF",
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
      <div className="mt-5 pt-3 border-t border-[#007991]/30 flex items-center justify-between text-xs">
        <span className="text-[#97EFE9]/80 font-medium">Blank initial state</span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 font-bold text-[#97EFE9] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#97EFE9]" />
          Clear Sleep
        </button>
      </div>
    </div>
  );
};
