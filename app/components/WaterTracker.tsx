"use client";

import React from "react";
import { Droplets, Plus, Minus, RotateCcw, Award } from "lucide-react";

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

  const liquidHeightPercent = Math.min(96, Math.max(0, (waterGlasses / target) * 94));

  return (
    <div className="theme-card rounded-2xl p-6 transition-all flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
                border: "1px solid #007991",
              }}
            >
              <Droplets className="w-4 h-4 text-[#007991]" />
            </div>
            <div>
              <h3
                className="text-base font-bold tracking-tight"
                style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
              >
                Water Intake
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
                Goal: {goalGlasses ? `${goalGlasses} glasses` : "Set in Planner"} (~250ml)
              </p>
            </div>
          </div>

          {waterGlasses >= target && target > 0 ? (
            <span
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              <Award className="w-3.5 h-3.5 text-[#007991]" />
              Target Reached
            </span>
          ) : (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
                color: isDarkMode ? "#97EFE9" : "#007991",
              }}
            >
              {progressPercent}%
            </span>
          )}
        </div>

        {/* Clean Glass Animation & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-6">
          {/* Minimalist Glass Container */}
          <div className="relative flex flex-col items-center">
            <div
              className="relative w-24 h-40 rounded-b-2xl border-2 overflow-hidden transition-transform hover:scale-105"
              style={{
                borderColor: isDarkMode ? "#334155" : "#CBD5E1",
                backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
                clipPath: "polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)",
              }}
            >
              {/* Glass subtle shine */}
              <div className="absolute top-2 left-2 w-1 h-32 bg-white/20 rounded-full pointer-events-none z-10" />

              {/* Rising Water */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-600 ease-out overflow-hidden"
                style={{
                  height: `${liquidHeightPercent}%`,
                  background: "linear-gradient(180deg, #97EFE9 0%, #007991 100%)",
                }}
              >
                {/* Gentle Wave on Top */}
                {liquidHeightPercent > 0 && (
                  <div className="absolute -top-2 left-0 w-[200%] h-5 pointer-events-none opacity-80">
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

                {/* Floating Bubbles */}
                {liquidHeightPercent > 15 && (
                  <>
                    <div className="absolute left-3 bottom-1 w-1.5 h-1.5 rounded-full bg-white/50 animate-bubble-1" />
                    <div className="absolute right-4 bottom-2 w-1.5 h-1.5 rounded-full bg-white/60 animate-bubble-2" />
                  </>
                )}
              </div>

              {/* Center glasses counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span
                  className="text-sm font-extrabold"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : isDarkMode ? "#F8FAFC" : "#222E50",
                  }}
                >
                  {waterGlasses} / {target}
                </span>
                <span
                  className="text-[9px] font-bold uppercase"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : isDarkMode ? "#8699B8" : "#8496B3",
                  }}
                >
                  glasses
                </span>
              </div>
            </div>
          </div>

          {/* Quick Counter Info & Buttons */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-center sm:text-left">
              <div
                className="text-3xl font-extrabold tracking-tight"
                style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
              >
                {(waterGlasses * 0.25).toFixed(2)}{" "}
                <span className="text-sm font-semibold">Litres</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
                {waterGlasses === 0
                  ? "Tap +1 to start drinking"
                  : `${waterGlasses} of ${target} glasses logged`}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleIncrement(-1)}
                disabled={waterGlasses <= 0}
                className="p-2.5 rounded-xl border transition-all disabled:opacity-30 hover:opacity-80 active:scale-95 cursor-pointer"
                style={{
                  borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
                  color: isDarkMode ? "#F8FAFC" : "#222E50",
                  backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
                }}
                title="Subtract 1 glass"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="px-4 py-2.5 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 shadow-xs cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
                title="Add 1 glass"
              >
                <Plus className="w-4 h-4 text-[#97EFE9]" />
                <span className="text-xs">+1 Glass</span>
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1 cursor-pointer"
                style={{
                  backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
                  color: isDarkMode ? "#97EFE9" : "#222E50",
                  border: "1px solid #007991",
                }}
                title="Add 2 glasses (Bottle)"
              >
                <span>+2 Bottle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div
            className="flex justify-between text-xs mb-1 font-medium"
            style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}
          >
            <span>Progress: {waterGlasses} of {target} glasses</span>
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
          Clear Water
        </button>
      </div>
    </div>
  );
};
