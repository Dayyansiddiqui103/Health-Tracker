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
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#007991", border: "2px solid #97EFE9" }}
          >
            <CalendarDays className="w-6 h-6 text-[#97EFE9]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
              Daily Health Planner
            </h2>
            <p className="text-xs md:text-sm font-medium text-[#97EFE9]">
              Set your health intentions and targets for the day. All inputs are manual.
            </p>
          </div>
        </div>

        {/* Save & Sync Button */}
        <div className="flex items-center gap-3">
          {showSavedToast && (
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              <CheckCircle className="w-4 h-4 text-[#007991]" />
              Checklist Synced!
            </span>
          )}
          <button
            type="button"
            onClick={handleSavePlan}
            className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
          >
            <Sparkles className="w-4 h-4 text-[#007991]" />
            Save & Sync Checklist
          </button>
        </div>
      </div>

      {/* Target Goals Grid - Colorful Palette Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {/* 1. Daily Water Intake Target Card */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md"
          style={{
            background: "linear-gradient(135deg, #007991 0%, #005F73 100%)",
            borderColor: "#97EFE9",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="water-goal-input"
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-white"
            >
              <Droplets className="w-4 h-4 text-[#97EFE9]" />
              Water Goal (Glasses)
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-extrabold"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              Daily
            </span>
          </div>
          <p className="text-xs mb-3 text-[#97EFE9] font-medium">
            Target glasses (~250ml per glass)
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
              className="w-full text-lg font-extrabold px-3.5 py-2.5 rounded-xl border focus-ring text-white"
              style={{
                backgroundColor: "#222E50",
                borderColor: "#97EFE9",
              }}
            />
            <span className="absolute right-3.5 top-3 text-xs font-bold text-[#97EFE9] pointer-events-none">
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
                className="text-xs font-bold px-2.5 py-1 rounded-lg border transition-all hover:scale-105 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: plan.waterGoalGlasses === num ? "#97EFE9" : "#222E50",
                  borderColor: "#97EFE9",
                  color: plan.waterGoalGlasses === num ? "#222E50" : "#FFFFFF",
                }}
              >
                {num} glasses
              </button>
            ))}
          </div>
        </div>

        {/* 2. Daily Sleep Target Card */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md"
          style={{
            background: "linear-gradient(135deg, #222E50 0%, #151D33 100%)",
            borderColor: "#007991",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="sleep-goal-input"
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-white"
            >
              <Moon className="w-4 h-4 text-[#97EFE9]" />
              Sleep Goal (Hours)
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-extrabold"
              style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
            >
              Rest
            </span>
          </div>
          <p className="text-xs mb-3 text-[#97EFE9] font-medium">
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
              className="w-full text-lg font-extrabold px-3.5 py-2.5 rounded-xl border focus-ring text-white"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
              }}
            />
            <span className="absolute right-3.5 top-3 text-xs font-bold text-[#97EFE9] pointer-events-none">
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
                className="text-xs font-bold px-2.5 py-1 rounded-lg border transition-all hover:scale-105 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: plan.sleepGoalHours === num ? "#97EFE9" : "#0D1424",
                  borderColor: "#007991",
                  color: plan.sleepGoalHours === num ? "#222E50" : "#FFFFFF",
                }}
              >
                {num}h
              </button>
            ))}
          </div>
        </div>

        {/* 3. Daily Intention / Focus Note Card */}
        <div
          className="p-5 rounded-2xl border transition-all shadow-md"
          style={{
            background: "linear-gradient(135deg, #1A2846 0%, #007991 100%)",
            borderColor: "#97EFE9",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="focus-note-input"
              className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-white"
            >
              <BookOpen className="w-4 h-4 text-[#97EFE9]" />
              Study & Focus Note
            </label>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-extrabold"
              style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
            >
              Intention
            </span>
          </div>
          <p className="text-xs mb-3 text-[#97EFE9] font-medium">
            Personal intention or study break reminder
          </p>
          <textarea
            id="focus-note-input"
            rows={3}
            placeholder="e.g. Stretch every 45 mins, drink 1 glass before lecture, take evening walk..."
            value={plan.focusNote}
            onChange={(e) => onUpdatePlan({ ...plan, focusNote: e.target.value })}
            className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white font-medium resize-none"
            style={{
              backgroundColor: "#222E50",
              borderColor: "#97EFE9",
            }}
          />
        </div>
      </div>

      {/* Planned Exercises Section */}
      <div
        className="mt-6 p-5 rounded-2xl border shadow-md"
        style={{
          backgroundColor: "#162038",
          borderColor: "#007991",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#97EFE9]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Planned Exercises For Today
            </h3>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
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
              className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white font-medium"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
              }}
            />
          </div>
          <div className="sm:col-span-3">
            <select
              value={exerciseCategory}
              onChange={(e) => setExerciseCategory(e.target.value as PlannedExercise["category"])}
              className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white cursor-pointer"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
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
              className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white font-medium"
              style={{
                backgroundColor: "#0D1424",
                borderColor: "#007991",
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              style={{ backgroundColor: "#007991", color: "#FFFFFF", border: "1px solid #97EFE9" }}
            >
              <Plus className="w-4 h-4 text-[#97EFE9]" />
              Add Plan
            </button>
          </div>
        </form>

        {/* List of Planned Exercises */}
        {plan.plannedExercises.length === 0 ? (
          <div
            className="text-center py-6 border border-dashed rounded-2xl"
            style={{ borderColor: "#007991" }}
          >
            <p className="text-xs font-medium text-[#97EFE9]">
              No exercises planned yet. Enter an exercise above to plan your day.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {plan.plannedExercises.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all shadow-xs"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
                }}
              >
                <div>
                  <div className="font-bold text-sm text-white">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[#97EFE9]">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                      style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
                    >
                      {item.category}
                    </span>
                    <span className="font-semibold text-white">{item.durationMinutes} mins</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePlannedExercise(item.id)}
                  className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer text-[#97EFE9]"
                  title="Remove planned exercise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
