"use client";

import React from "react";
import { HealthData } from "../types";
import { Award, Droplets, Moon, Dumbbell, CheckCircle2, HeartPulse, GraduationCap, RotateCcw, Printer } from "lucide-react";

interface DailySummaryProps {
  data: HealthData;
  isDarkMode: boolean;
  onOpenResetModal: () => void;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ data, onOpenResetModal }) => {
  const { plan, waterGlasses, sleep, exercises, checklist } = data;

  const completedTasks = checklist.filter((t) => t.completed).length;
  const totalTasks = checklist.length;
  const checklistPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const waterTarget = typeof plan.waterGoalGlasses === "number" && plan.waterGoalGlasses > 0 ? plan.waterGoalGlasses : 8;
  const waterPercent = Math.min(100, Math.round((waterGlasses / waterTarget) * 100));

  const sleepTarget = typeof plan.sleepGoalHours === "number" && plan.sleepGoalHours > 0 ? plan.sleepGoalHours : 8;
  const sleepActual = typeof sleep.hours === "number" ? sleep.hours : 0;
  const sleepPercent = Math.min(100, Math.round((sleepActual / sleepTarget) * 100));

  const totalExerciseMinutes = exercises.reduce((sum, e) => sum + e.durationMinutes, 0);

  // Overall Health Score for Students (0 - 100)
  const healthScore = Math.round(
    (waterPercent * 0.35) + (sleepPercent * 0.35) + (Math.min(100, (totalExerciseMinutes / 30) * 100) * 0.30)
  );

  return (
    <section
      className="rounded-3xl p-6 md:p-8 transition-all border shadow-lg"
      style={{
        background: "linear-gradient(145deg, #18223C 0%, #222E50 100%)",
        borderColor: "#007991",
        boxShadow: "0 10px 30px rgba(0, 121, 145, 0.2)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#007991]/30 gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            style={{
              backgroundColor: "#007991",
              border: "2px solid #97EFE9",
            }}
          >
            <HeartPulse className="w-6 h-6 text-[#97EFE9]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              Today&apos;s Health Overview & Score
            </h2>
            <p className="text-xs text-[#97EFE9] font-medium">
              Quick summary of hydration, rest, workouts, and completed checklist habits
            </p>
          </div>
        </div>

        {/* Health Score Badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-extrabold shadow-md"
          style={{
            backgroundColor: "#97EFE9",
            borderColor: "#FFFFFF",
            color: "#222E50",
          }}
        >
          <Award className="w-4 h-4 text-[#007991]" />
          <span>Health Score: {healthScore}/100</span>
        </div>
      </div>

      {/* 4 Cards Grid - Styled with palette #97EFE9, #007991, #222E50 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Card 1: Water */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #007991 0%, #005F73 100%)",
            borderColor: "#97EFE9",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#97EFE9]">
              Water
            </span>
            <Droplets className="w-4 h-4 text-[#97EFE9]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {waterGlasses} <span className="text-xs font-medium text-[#97EFE9]">/ {waterTarget} gl</span>
          </div>
          <div className="text-[11px] font-bold mt-1 text-[#97EFE9]/90">
            {waterPercent}% of target
          </div>
        </div>

        {/* Card 2: Sleep */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #222E50 0%, #16223B 100%)",
            borderColor: "#007991",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#97EFE9]">
              Sleep
            </span>
            <Moon className="w-4 h-4 text-[#97EFE9]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {sleepActual} <span className="text-xs font-medium text-[#97EFE9]">/ {sleepTarget} hrs</span>
          </div>
          <div className="text-[11px] font-bold mt-1 text-[#97EFE9]/90">
            {sleep.quality ? `Quality: ${sleep.quality}` : "Unrated"}
          </div>
        </div>

        {/* Card 3: Exercise */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #0D2840 0%, #007991 100%)",
            borderColor: "#97EFE9",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#97EFE9]">
              Exercise
            </span>
            <Dumbbell className="w-4 h-4 text-[#97EFE9]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalExerciseMinutes} <span className="text-xs font-medium text-[#97EFE9]">mins</span>
          </div>
          <div className="text-[11px] font-bold mt-1 text-[#97EFE9]/90">
            {exercises.length} activities logged
          </div>
        </div>

        {/* Card 4: Checklist */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #182C4C 0%, #222E50 100%)",
            borderColor: "#007991",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#97EFE9]">
              Checklist
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#97EFE9]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {completedTasks} <span className="text-xs font-medium text-[#97EFE9]">/ {totalTasks} tasks</span>
          </div>
          <div className="text-[11px] font-bold mt-1 text-[#97EFE9]/90">
            {checklistPercent}% completed
          </div>
        </div>
      </div>

      {/* Student Health Tip Banner */}
      <div
        className="mt-6 p-4 rounded-2xl border flex items-center gap-3.5 text-xs md:text-sm shadow-sm"
        style={{
          background: "linear-gradient(135deg, rgba(0, 121, 145, 0.35) 0%, rgba(34, 46, 80, 0.5) 100%)",
          borderColor: "#007991",
        }}
      >
        <GraduationCap className="w-5 h-5 flex-shrink-0 text-[#97EFE9]" />
        <div>
          <span className="font-extrabold text-[#97EFE9]">Student Wellness Tip: </span>
          <span className="text-white/90 font-medium">
            Hydrating before lectures boosts concentration and memory retention. Taking a 5-minute stretch break every study hour reduces eye strain and recharges focus!
          </span>
        </div>
      </div>

      {/* Actions: Print and Reset All Data */}
      <div className="mt-6 pt-5 border-t border-[#007991]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          style={{
            backgroundColor: "#007991",
            borderColor: "#97EFE9",
            color: "#FFFFFF",
          }}
        >
          <Printer className="w-4 h-4 text-[#97EFE9]" />
          <span>Print / Export Summary</span>
        </button>

        <button
          type="button"
          onClick={onOpenResetModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold border transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          style={{
            backgroundColor: "#222E50",
            borderColor: "#97EFE9",
            color: "#97EFE9",
          }}
          title="Reset all health inputs to blank state"
        >
          <RotateCcw className="w-4 h-4 text-[#97EFE9]" />
          <span>Reset All Data to Blank</span>
        </button>
      </div>
    </section>
  );
};
