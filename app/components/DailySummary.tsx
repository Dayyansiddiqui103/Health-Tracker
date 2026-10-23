"use client";

import React from "react";
import { HealthData } from "../types";
import { Award, Droplets, Moon, Dumbbell, CheckCircle2, HeartPulse, GraduationCap, RotateCcw, Printer } from "lucide-react";

interface DailySummaryProps {
  data: HealthData;
  isDarkMode: boolean;
  onOpenResetModal: () => void;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ data, isDarkMode, onOpenResetModal }) => {
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
    <section className="theme-card rounded-2xl p-6 md:p-8 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
              border: "1px solid #007991",
            }}
          >
            <HeartPulse className="w-5 h-5 text-[#007991]" />
          </div>
          <div>
            <h2
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              Today&apos;s Health Overview & Score
            </h2>
            <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Quick summary of hydration, rest, workouts, and completed checklist habits
            </p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold"
          style={{
            backgroundColor: isDarkMode ? "#172138" : "#F1F5F8",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
            color: isDarkMode ? "#97EFE9" : "#222E50",
          }}
        >
          <Award className="w-4 h-4 text-[#007991]" />
          <span>Health Score: {healthScore}/100</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Water */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Water
            </span>
            <Droplets className="w-4 h-4 text-[#007991]" />
          </div>
          <div className="text-2xl font-extrabold" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
            {waterGlasses} <span className="text-xs font-normal">/ {waterTarget} glasses</span>
          </div>
          <div className="text-[11px] font-medium mt-1" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            {waterPercent}% of target
          </div>
        </div>

        {/* Sleep */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Sleep
            </span>
            <Moon className="w-4 h-4 text-[#007991]" />
          </div>
          <div className="text-2xl font-extrabold" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
            {sleepActual} <span className="text-xs font-normal">/ {sleepTarget} hrs</span>
          </div>
          <div className="text-[11px] font-medium mt-1" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            {sleep.quality ? `Quality: ${sleep.quality}` : "Unrated"}
          </div>
        </div>

        {/* Exercise */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Exercise
            </span>
            <Dumbbell className="w-4 h-4 text-[#007991]" />
          </div>
          <div className="text-2xl font-extrabold" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
            {totalExerciseMinutes} <span className="text-xs font-normal">mins</span>
          </div>
          <div className="text-[11px] font-medium mt-1" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            {exercises.length} activities logged
          </div>
        </div>

        {/* Checklist */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Checklist
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#007991]" />
          </div>
          <div className="text-2xl font-extrabold" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
            {completedTasks} <span className="text-xs font-normal">/ {totalTasks} tasks</span>
          </div>
          <div className="text-[11px] font-medium mt-1" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            {checklistPercent}% completed
          </div>
        </div>
      </div>

      {/* Student Health Tip Banner */}
      <div
        className="mt-6 p-4 rounded-2xl border flex items-center gap-3.5 text-xs md:text-sm"
        style={{
          backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
          borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          color: isDarkMode ? "#F8FAFC" : "#222E50",
        }}
      >
        <GraduationCap className="w-5 h-5 flex-shrink-0 text-[#007991]" />
        <div>
          <span className="font-bold">Student Wellness Tip: </span>
          <span style={{ color: isDarkMode ? "#8699B8" : "#4A5B7D" }}>
            Hydrating before lectures boosts concentration and memory retention. Taking a 5-minute stretch break every study hour reduces eye strain and recharges focus!
          </span>
        </div>
      </div>

      {/* Actions: Print and Reset All Data */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold transition-all hover:opacity-85 cursor-pointer"
          style={{
            borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
            color: isDarkMode ? "#F8FAFC" : "#222E50",
            backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
          }}
        >
          <Printer className="w-4 h-4 text-[#007991]" />
          <span>Print / Export Summary</span>
        </button>

        <button
          type="button"
          onClick={onOpenResetModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border transition-all hover:opacity-85 cursor-pointer"
          style={{
            backgroundColor: isDarkMode ? "#222E50" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
            color: isDarkMode ? "#97EFE9" : "#222E50",
          }}
          title="Reset all health inputs to blank state"
        >
          <RotateCcw className="w-4 h-4 text-[#007991]" />
          <span>Reset All Data to Blank</span>
        </button>
      </div>
    </section>
  );
};
