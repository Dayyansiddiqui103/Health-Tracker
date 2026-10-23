"use client";

import React, { useState } from "react";
import { LoggedExercise } from "../types";
import { Dumbbell, Plus, Trash2, Flame, Timer, Activity, RotateCcw } from "lucide-react";

interface ExerciseTrackerProps {
  exercises: LoggedExercise[];
  onAddExercise: (exercise: Omit<LoggedExercise, "id" | "timestamp">) => void;
  onDeleteExercise: (id: string) => void;
  onClearExercises: () => void;
  isDarkMode: boolean;
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  exercises,
  onAddExercise,
  onDeleteExercise,
  onClearExercises,
  isDarkMode,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cardio");
  const [duration, setDuration] = useState<number | "">("");
  const [intensity, setIntensity] = useState<LoggedExercise["intensity"]>("Moderate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddExercise({
      name: name.trim(),
      category,
      durationMinutes: Number(duration) || 20,
      intensity,
    });

    setName("");
    setDuration("");
  };

  const totalMinutes = exercises.reduce((sum, item) => sum + item.durationMinutes, 0);

  return (
    <div className="theme-card rounded-2xl p-6 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#007991]/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: "#222E50", border: "1.5px solid #007991" }}
            >
              <Dumbbell className="w-5 h-5 text-[#97EFE9]" />
            </div>
            <div>
              <h3
                className="text-base font-bold tracking-tight"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Exercise & Activities
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
                Log physical activities performed today
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: isDarkMode ? "#222E50" : "#E8F8F7",
              color: isDarkMode ? "#97EFE9" : "#007991",
              border: "1px solid #007991",
            }}
          >
            <Timer className="w-3.5 h-3.5 text-[#007991]" />
            <span>{totalMinutes} mins total</span>
          </div>
        </div>

        {/* Manual Exercise Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="exercise-name-input"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Exercise Name
              </label>
              <input
                id="exercise-name-input"
                type="text"
                placeholder="e.g. Jogging, Dorm Yoga, Cycling, Gym"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring"
                style={{
                  backgroundColor: isDarkMode ? "#131B30" : "#F4FBFB",
                  borderColor: "#007991",
                  color: isDarkMode ? "#F0FCFB" : "#222E50",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="exercise-category-select"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Category
              </label>
              <select
                id="exercise-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring cursor-pointer"
                style={{
                  backgroundColor: isDarkMode ? "#131B30" : "#F4FBFB",
                  borderColor: "#007991",
                  color: isDarkMode ? "#F0FCFB" : "#222E50",
                }}
              >
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength / Weights</option>
                <option value="Flexibility">Flexibility / Yoga</option>
                <option value="Walking">Walking / Steps</option>
                <option value="Sport">Sport / Badminton</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="exercise-duration-input"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Duration (Mins)
              </label>
              <input
                id="exercise-duration-input"
                type="number"
                min="1"
                max="600"
                placeholder="e.g. 30"
                value={duration === "" ? "" : duration}
                onChange={(e) => setDuration(e.target.value === "" ? "" : parseInt(e.target.value) || "")}
                className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring"
                style={{
                  backgroundColor: isDarkMode ? "#131B30" : "#F4FBFB",
                  borderColor: "#007991",
                  color: isDarkMode ? "#F0FCFB" : "#222E50",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="exercise-intensity-select"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDarkMode ? "#97EFE9" : "#222E50" }}
              >
                Intensity
              </label>
              <select
                id="exercise-intensity-select"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as LoggedExercise["intensity"])}
                className="w-full text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring cursor-pointer"
                style={{
                  backgroundColor: isDarkMode ? "#131B30" : "#F4FBFB",
                  borderColor: "#007991",
                  color: isDarkMode ? "#F0FCFB" : "#222E50",
                }}
              >
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
              >
                <Plus className="w-4 h-4 text-[#97EFE9]" />
                Log Workout
              </button>
            </div>
          </div>
        </form>

        {/* Exercises Logged List (Blank Initial State) */}
        <div className="mt-5">
          <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
            Today&apos;s Completed Activities ({exercises.length})
          </div>

          {exercises.length === 0 ? (
            <div
              className="text-center py-6 border border-dashed rounded-xl"
              style={{ borderColor: isDarkMode ? "#2F3E68" : "#CBEFEE" }}
            >
              <Activity className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-[#007991]" />
              <p className="text-xs" style={{ color: isDarkMode ? "#8AA0C7" : "#64779F" }}>
                No exercises logged yet. Log an activity above to track physical habits.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {exercises.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all shadow-xs"
                  style={{
                    backgroundColor: isDarkMode ? "#131B30" : "#FFFFFF",
                    borderColor: isDarkMode ? "#2F3E68" : "#CBEFEE",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
                    >
                      <Flame className="w-4 h-4 text-[#007991]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: isDarkMode ? "#F0FCFB" : "#222E50" }}>
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
                        <span className="font-semibold">{item.durationMinutes} mins</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="font-medium text-[#007991]">{item.intensity} intensity</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: isDarkMode ? "#8AA0C7" : "#64779F" }}>
                      {item.timestamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExercise(item.id)}
                      className="p-1 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                      title="Delete logged exercise"
                      style={{ color: "#007991" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Reset */}
      <div className="mt-5 pt-3 border-t border-[#007991]/20 flex items-center justify-between text-xs">
        <span style={{ color: isDarkMode ? "#8AA0C7" : "#64779F" }}>
          Blank initial state (0 exercises)
        </span>
        <button
          type="button"
          onClick={onClearExercises}
          disabled={exercises.length === 0}
          className="flex items-center gap-1 font-medium hover:opacity-75 transition-opacity disabled:opacity-30 cursor-pointer"
          style={{ color: "#007991" }}
        >
          <RotateCcw className="w-3 h-3 text-[#007991]" />
          Clear Exercises
        </button>
      </div>
    </div>
  );
};
