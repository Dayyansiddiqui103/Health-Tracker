"use client";

import React from "react";
import { Droplets, Plus, Minus, RotateCcw, Award, Sparkles } from "lucide-react";

interface WaterTrackerProps {
  waterGlasses: number;
  goalGlasses: number | "";
  onUpdateWater: (glasses: number) => void;
  isDarkMode: boolean;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterGlasses,
  goalGlasses,
  onUpdateWater,
  isDarkMode,
}) => {
  const target = typeof goalGlasses === "number" && goalGlasses > 0 ? goalGlasses : 8;
  const progressPercent = Math.min(100, Math.round((waterGlasses / target) * 100));

  const handleIncrement = (amount: number) => {
    onUpdateWater(Math.max(0, waterGlasses + amount));
  };

  const handleReset = () => {
    onUpdateWater(0);
  };

  // Height percentage of the water inside the glass (clamped between 0 and 96%)
  const liquidHeightPercent = Math.min(96, Math.max(0, (waterGlasses / target) * 94));

  return (
    <div className="theme-card rounded-2xl p-6 transition-all flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#007991]/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: "#007991" }}
            >
              <Droplets className="w-5 h-5 text-[#97EFE9]" />
            </div>
            <div>
              <h3
                className="text-base font-bold tracking-tight"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Water Intake
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
                Target: {goalGlasses ? `${goalGlasses} glasses` : "Set in Planner"} (~250ml / glass)
              </p>
            </div>
          </div>

          {/* Badge */}
          {waterGlasses >= target && target > 0 ? (
            <span
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              <Award className="w-3.5 h-3.5 text-[#007991]" />
              Target Reached!
            </span>
          ) : (
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isDarkMode ? "#222E50" : "#E8F8F7",
                color: isDarkMode ? "#97EFE9" : "#007991",
                border: "1px solid #007991",
              }}
            >
              {progressPercent}%
            </span>
          )}
        </div>

        {/* Realistic Animated Glass & Stats Container */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-6">
          {/* Animated Interactive Glass of Water */}
          <div className="relative flex flex-col items-center">
            {/* The Glass Container */}
            <div
              className="relative w-28 h-44 rounded-b-2xl border-4 overflow-hidden shadow-lg transition-transform hover:scale-105"
              style={{
                borderColor: isDarkMode ? "#97EFE9" : "#007991",
                background: isDarkMode
                  ? "linear-gradient(180deg, rgba(34, 46, 80, 0.4) 0%, rgba(26, 35, 61, 0.8) 100%)"
                  : "linear-gradient(180deg, rgba(232, 248, 247, 0.5) 0%, rgba(203, 239, 238, 0.7) 100%)",
                boxShadow: "0 8px 32px 0 rgba(0, 121, 145, 0.15)",
                clipPath: "polygon(5% 0%, 95% 0%, 88% 100%, 12% 100%)",
              }}
            >
              {/* Glass Rim Reflection */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
                style={{ backgroundColor: "#97EFE9" }}
              />

              {/* Side Glass Highlight Reflection */}
              <div className="absolute top-2 left-2 w-1.5 h-36 bg-white/20 rounded-full blur-[0.5px] pointer-events-none z-10" />

              {/* Rising Liquid */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out overflow-hidden"
                style={{
                  height: `${liquidHeightPercent}%`,
                  background: "linear-gradient(180deg, #97EFE9 0%, #007991 100%)",
                }}
              >
                {/* Animated Wave Top on Water */}
                {liquidHeightPercent > 0 && (
                  <div className="absolute -top-3 left-0 w-[200%] h-6 pointer-events-none opacity-80">
                    <svg
                      viewBox="0 0 500 150"
                      preserveAspectRatio="none"
                      className="w-full h-full animate-wave"
                    >
                      <path
                        d="M0,70 C150,130 350,10 500,70 L500,150 L0,150 Z"
                        fill="#97EFE9"
                      />
                    </svg>
                  </div>
                )}

                {/* Animated Floating Bubbles */}
                {liquidHeightPercent > 15 && (
                  <>
                    <div className="absolute left-4 bottom-1 w-2 h-2 rounded-full bg-white/60 animate-bubble-1" />
                    <div className="absolute left-10 bottom-2 w-1.5 h-1.5 rounded-full bg-white/70 animate-bubble-2" />
                    <div className="absolute right-5 bottom-1 w-2.5 h-2.5 rounded-full bg-white/50 animate-bubble-3" />
                  </>
                )}
              </div>

              {/* Center Water Percentage Indicator inside the Glass */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span
                  className="text-base font-extrabold drop-shadow-md tracking-tight"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : isDarkMode ? "#F0FCFB" : "#222E50",
                  }}
                >
                  {waterGlasses} / {target}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : isDarkMode ? "#97EFE9" : "#007991",
                  }}
                >
                  glasses
                </span>
              </div>
            </div>

            {/* Glass Pedestal / Shadow */}
            <div
              className="w-20 h-2 rounded-full mt-2 blur-[1px]"
              style={{
                backgroundColor: isDarkMode ? "rgba(151, 239, 233, 0.15)" : "rgba(0, 121, 145, 0.2)",
              }}
            />
          </div>

          {/* Quick Counter Info & Buttons */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-extrabold tracking-tight" style={{ color: isDarkMode ? "#F0FCFB" : "#222E50" }}>
                {(waterGlasses * 0.25).toFixed(2)} <span className="text-sm font-semibold">Litres</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
                {waterGlasses === 0
                  ? "Tap +1 to start drinking today"
                  : `${waterGlasses} of ${target} recommended glasses`}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleIncrement(-1)}
                disabled={waterGlasses <= 0}
                className="p-2.5 rounded-xl border transition-all disabled:opacity-30 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  borderColor: "#007991",
                  color: isDarkMode ? "#97EFE9" : "#222E50",
                  backgroundColor: isDarkMode ? "#1A233D" : "#FFFFFF",
                }}
                title="Subtract 1 glass"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="px-3.5 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
                title="Add 1 glass"
              >
                <Plus className="w-4 h-4 text-[#97EFE9]" />
                <span className="text-xs">+1 Glass</span>
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(2)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                style={{ backgroundColor: "#222E50", color: "#97EFE9", border: "1px solid #007991" }}
                title="Add 2 glasses (500ml Bottle)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+2 Bottle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1 font-medium" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
            <span>Hydration Goal: {target} glasses</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="w-full h-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: isDarkMode ? "#222E50" : "#E8F8F7" }}
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
      </div>

      {/* Footer Reset */}
      <div className="mt-5 pt-3 border-t border-[#007991]/20 flex items-center justify-between text-xs">
        <span style={{ color: isDarkMode ? "#8AA0C7" : "#64779F" }}>
          Blank initial state (0 glasses)
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 font-medium hover:opacity-75 transition-opacity cursor-pointer"
          style={{ color: "#007991" }}
        >
          <RotateCcw className="w-3 h-3 text-[#007991]" />
          Clear Water
        </button>
      </div>
    </div>
  );
};
