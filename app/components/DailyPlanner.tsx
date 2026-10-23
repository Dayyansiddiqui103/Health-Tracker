"use client";

import React, { useState } from "react";
import { DailyPlan, PlannedExercise } from "../types";
import { CalendarDays, Droplets, Moon, Dumbbell, Plus, Trash2, CheckCircle, Sparkles, BookOpen } from "lucide-react";

interface DailyPlannerProps {
  plan: DailyPlan;
  onUpdatePlan: (newPlan: DailyPlan) => void;
  isDarkMode: boolean;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  plan,
  onUpdatePlan,
  isDarkMode,
}) => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState<number | "">("");
  const [exerciseCategory, setExerciseCategory] = useState<PlannedExercise["category"]>("Cardio");
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleAddPlannedExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    const newExercise: PlannedExercise = {
      id: "plan-ex-" + Date.now(),
      name: exerciseName.trim(),
      durationMinutes: Number(exerciseDuration) || 20,
      category: exerciseCategory,
    };

    onUpdatePlan({
      ...plan,
      plannedExercises: [...plan.plannedExercises, newExercise],
    });

    setExerciseName("");
    setExerciseDuration("");
  };

  const handleRemovePlannedExercise = (id: string) => {
    onUpdatePlan({
      ...plan,
      plannedExercises: plan.plannedExercises.filter((item) => item.id !== id),
    });
  };

  const handleSavePlan = () => {
    onUpdatePlan({
      ...plan,
      isPlanSaved: true,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

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
            <CalendarDays className="w-5 h-5 text-[#007991]" />
          </div>
          <div>
            <h2
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              Daily Health Planner
            </h2>
            <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Set your health targets and intentions for the day. All inputs are manual.
            </p>
          </div>
        </div>

        {/* Save & Sync Button */}
        <div className="flex items-center gap-3">
          {showSavedToast && (
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              <CheckCircle className="w-4 h-4 text-[#007991]" />
              Checklist Synced!
            </span>
          )}
          <button
            type="button"
            onClick={handleSavePlan}
            className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
            style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
          >
            <Sparkles className="w-4 h-4 text-[#97EFE9]" />
            Save & Sync Checklist
          </button>
        </div>
      </div>

      {/* Target Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {/* 1. Daily Water Intake Target */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="water-goal-input"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              <Droplets className="w-3.5 h-3.5 text-[#007991]" />
              Water Goal (Glasses)
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8", color: isDarkMode ? "#97EFE9" : "#007991" }}
            >
              Daily
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            Target glasses of water (~250ml per glass)
          </p>
          <div className="relative">
            <input
              id="water-goal-input"
              type="number"
              min="0"
              max="30"
              placeholder="e.g. 8"
              value={plan.waterGoalGlasses === "" ? "" : plan.waterGoalGlasses}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0);
                onUpdatePlan({ ...plan, waterGoalGlasses: val });
              }}
              className="w-full text-base font-bold px-3.5 py-2 rounded-xl border focus-ring transition-colors"
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
              glasses
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-3">
            {[6, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdatePlan({ ...plan, waterGoalGlasses: num })}
                className="text-xs font-medium px-2.5 py-1 rounded-lg border transition-all hover:opacity-85 cursor-pointer"
                style={{
                  backgroundColor: plan.waterGoalGlasses === num ? "#007991" : "transparent",
                  color: plan.waterGoalGlasses === num ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
                  borderColor: plan.waterGoalGlasses === num ? "#007991" : isDarkMode ? "#27375A" : "#E2E8F0",
                }}
              >
                {num} glasses
              </button>
            ))}
          </div>
        </div>

        {/* 2. Daily Sleep Target */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="sleep-goal-input"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              <Moon className="w-3.5 h-3.5 text-[#007991]" />
              Sleep Goal (Hours)
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8", color: isDarkMode ? "#97EFE9" : "#007991" }}
            >
              Rest
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            Target restorative sleep (e.g. 7 - 9 hours)
          </p>
          <div className="relative">
            <input
              id="sleep-goal-input"
              type="number"
              step="0.5"
              min="0"
              max="24"
              placeholder="e.g. 8"
              value={plan.sleepGoalHours === "" ? "" : plan.sleepGoalHours}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                onUpdatePlan({ ...plan, sleepGoalHours: val });
              }}
              className="w-full text-base font-bold px-3.5 py-2 rounded-xl border focus-ring transition-colors"
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
              hours
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-3">
            {[7, 7.5, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdatePlan({ ...plan, sleepGoalHours: num })}
                className="text-xs font-medium px-2.5 py-1 rounded-lg border transition-all hover:opacity-85 cursor-pointer"
                style={{
                  backgroundColor: plan.sleepGoalHours === num ? "#007991" : "transparent",
                  color: plan.sleepGoalHours === num ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
                  borderColor: plan.sleepGoalHours === num ? "#007991" : isDarkMode ? "#27375A" : "#E2E8F0",
                }}
              >
                {num}h
              </button>
            ))}
          </div>
        </div>

        {/* 3. Daily Intention / Focus Note */}
        <div
          className="p-5 rounded-2xl border transition-all"
          style={{
            backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="focus-note-input"
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#007991]" />
              Study & Focus Note
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8", color: isDarkMode ? "#97EFE9" : "#007991" }}
            >
              Optional
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
            Personal intention or study break reminder
          </p>
          <textarea
            id="focus-note-input"
            rows={3}
            placeholder="e.g. Stretch every 45 mins, drink 1 glass before lecture, take evening walk..."
            value={plan.focusNote}
            onChange={(e) => onUpdatePlan({ ...plan, focusNote: e.target.value })}
            className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring transition-colors resize-none"
            style={{
              backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
              borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
              color: isDarkMode ? "#F8FAFC" : "#222E50",
            }}
          />
        </div>
      </div>

      {/* Planned Exercises Section */}
      <div
        className="mt-6 p-5 rounded-2xl border"
        style={{
          backgroundColor: isDarkMode ? "#172138" : "#F8FAFC",
          borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#007991]" />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              Planned Exercises For Today
            </h3>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: isDarkMode ? "#222E50" : "#E2E8F0", color: isDarkMode ? "#97EFE9" : "#222E50" }}
          >
            {plan.plannedExercises.length} planned
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddPlannedExercise} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Exercise name (e.g. Campus Jog, Dorm Yoga, Gym)"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                color: isDarkMode ? "#F8FAFC" : "#222E50",
              }}
            />
          </div>
          <div className="sm:col-span-3">
            <select
              value={exerciseCategory}
              onChange={(e) => setExerciseCategory(e.target.value as PlannedExercise["category"])}
              className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring cursor-pointer"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                color: isDarkMode ? "#F8FAFC" : "#222E50",
              }}
            >
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength / Gym</option>
              <option value="Flexibility">Flexibility / Yoga</option>
              <option value="Walking">Walking / Steps</option>
              <option value="Sport">Sport</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <input
              type="number"
              min="1"
              max="300"
              placeholder="Mins (20)"
              value={exerciseDuration === "" ? "" : exerciseDuration}
              onChange={(e) => setExerciseDuration(e.target.value === "" ? "" : parseInt(e.target.value) || "")}
              className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                color: isDarkMode ? "#F8FAFC" : "#222E50",
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ backgroundColor: "#222E50", color: "#FFFFFF" }}
            >
              <Plus className="w-4 h-4 text-[#97EFE9]" />
              Add Plan
            </button>
          </div>
        </form>

        {/* List of Planned Exercises */}
        {plan.plannedExercises.length === 0 ? (
          <div
            className="text-center py-6 border border-dashed rounded-xl"
            style={{ borderColor: isDarkMode ? "#27375A" : "#E2E8F0" }}
          >
            <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              No exercises planned yet. Enter an exercise above to plan your day.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {plan.plannedExercises.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border text-xs transition-all shadow-xs"
                style={{
                  backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
                }}
              >
                <div>
                  <div className="font-bold text-sm" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8", color: isDarkMode ? "#97EFE9" : "#007991" }}
                    >
                      {item.category}
                    </span>
                    <span>{item.durationMinutes} mins</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePlannedExercise(item.id)}
                  className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                  title="Remove planned exercise"
                  style={{ color: "#007991" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
