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
    <div
      className="rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg border"
      style={{
        background: "linear-gradient(145deg, #222E50 0%, #162038 100%)",
        borderColor: "#007991",
        boxShadow: "0 8px 30px rgba(0, 121, 145, 0.2)",
      }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#007991]/30">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: "#007991", border: "1.5px solid #97EFE9" }}
            >
              <Droplets className="w-5 h-5 text-[#97EFE9]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white">
                Water Intake
              </h3>
              <p className="text-xs font-medium text-[#97EFE9]">
                Goal: {goalGlasses ? `${goalGlasses} glasses` : "Set in Planner"} (~250ml)
              </p>
            </div>
          </div>

          {waterGlasses >= target && target > 0 ? (
            <span
              className="flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs animate-bounce"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              <Award className="w-3.5 h-3.5 text-[#007991]" />
              Target Reached!
            </span>
          ) : (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border"
              style={{
                backgroundColor: "#007991",
                borderColor: "#97EFE9",
                color: "#FFFFFF",
              }}
            >
              {progressPercent}%
            </span>
          )}
        </div>

        {/* Animated Realistic Glass of Water */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-6">
          {/* Glass */}
          <div className="relative flex flex-col items-center">
            <div
              className="relative w-28 h-44 rounded-b-2xl border-2 overflow-hidden shadow-xl transition-transform hover:scale-105"
              style={{
                borderColor: "#97EFE9",
                backgroundColor: "rgba(0, 121, 145, 0.25)",
                boxShadow: "0 0 20px rgba(151, 239, 233, 0.25)",
                clipPath: "polygon(5% 0%, 95% 0%, 88% 100%, 12% 100%)",
              }}
            >
              {/* Glass Top Rim */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#97EFE9] opacity-90" />

              {/* Glass Side Reflection */}
              <div className="absolute top-2 left-2 w-1.5 h-36 bg-white/30 rounded-full pointer-events-none z-10" />

              {/* Rising Liquid */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out overflow-hidden"
                style={{
                  height: `${liquidHeightPercent}%`,
                  background: "linear-gradient(180deg, #97EFE9 0%, #007991 100%)",
                }}
              >
                {/* Wave on top */}
                {liquidHeightPercent > 0 && (
                  <div className="absolute -top-3 left-0 w-[200%] h-6 pointer-events-none opacity-90">
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

                {/* Bubbles */}
                {liquidHeightPercent > 15 && (
                  <>
                    <div className="absolute left-3 bottom-1 w-2 h-2 rounded-full bg-white/70 animate-bubble-1" />
                    <div className="absolute right-4 bottom-2 w-1.5 h-1.5 rounded-full bg-white/80 animate-bubble-2" />
                  </>
                )}
              </div>

              {/* Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span
                  className="text-base font-extrabold drop-shadow-md"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : "#FFFFFF",
                  }}
                >
                  {waterGlasses} / {target}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: liquidHeightPercent > 45 ? "#222E50" : "#97EFE9",
                  }}
                >
                  glasses
                </span>
              </div>
            </div>
          </div>

          {/* Volume text and action buttons */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-extrabold tracking-tight text-white">
                {(waterGlasses * 0.25).toFixed(2)}{" "}
                <span className="text-sm font-semibold text-[#97EFE9]">Litres</span>
              </div>
              <p className="text-xs mt-1 text-[#97EFE9] font-medium">
                {waterGlasses === 0
                  ? "Tap +1 to start drinking"
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
                  backgroundColor: "#162038",
                  borderColor: "#007991",
                  color: "#97EFE9",
                }}
                title="Subtract 1 glass"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(1)}
                className="px-4 py-2.5 rounded-xl font-extrabold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
                style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
                title="Add 1 glass"
              >
                <Plus className="w-4 h-4 text-[#222E50]" />
                <span className="text-xs">+1 Glass</span>
              </button>

              <button
                type="button"
                onClick={() => handleIncrement(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-md cursor-pointer border"
                style={{
                  backgroundColor: "#007991",
                  borderColor: "#97EFE9",
                  color: "#FFFFFF",
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
          <div className="flex justify-between text-xs mb-1.5 font-bold text-[#97EFE9]">
            <span>Progress: {waterGlasses} of {target} glasses</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden border border-[#007991]"
            style={{ backgroundColor: "#162038" }}
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
      <div className="mt-5 pt-3 border-t border-[#007991]/30 flex items-center justify-between text-xs">
        <span className="text-[#97EFE9]/80 font-medium">Blank initial state</span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 font-bold text-[#97EFE9] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#97EFE9]" />
          Clear Water
        </button>
      </div>
    </div>
  );
};
