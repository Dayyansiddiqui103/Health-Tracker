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
    <div
      className="rounded-3xl p-6 transition-all flex flex-col justify-between shadow-lg border"
      style={{
        background: "linear-gradient(145deg, #182442 0%, #222E50 100%)",
        borderColor: "#007991",
        boxShadow: "0 8px 30px rgba(0, 121, 145, 0.2)",
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
              <Dumbbell className="w-5 h-5 text-[#97EFE9]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-white">
                Exercise & Activities
              </h3>
              <p className="text-xs font-medium text-[#97EFE9]">
                Log physical activities performed today
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border"
            style={{
              backgroundColor: "#007991",
              borderColor: "#97EFE9",
              color: "#FFFFFF",
            }}
          >
            <Timer className="w-3.5 h-3.5 text-[#97EFE9]" />
            <span>{totalMinutes} mins total</span>
          </div>
        </div>

        {/* Manual Exercise Input Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="exercise-name-input"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#97EFE9]"
              >
                Exercise Name
              </label>
              <input
                id="exercise-name-input"
                type="text"
                placeholder="e.g. Campus Jog, Dorm Yoga, Gym"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white font-medium"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="exercise-category-select"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#97EFE9]"
              >
                Category
              </label>
              <select
                id="exercise-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white cursor-pointer"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
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
                className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#97EFE9]"
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
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white font-medium"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="exercise-intensity-select"
                className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#97EFE9]"
              >
                Intensity
              </label>
              <select
                id="exercise-intensity-select"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as LoggedExercise["intensity"])}
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring text-white cursor-pointer"
                style={{
                  backgroundColor: "#0D1424",
                  borderColor: "#007991",
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
                className="w-full py-2.5 px-3 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
              >
                <Plus className="w-4 h-4 text-[#222E50]" />
                Log Workout
              </button>
            </div>
          </div>
        </form>

        {/* Exercises Logged List */}
        <div className="mt-5">
          <div className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[#97EFE9]">
            Today&apos;s Completed Activities ({exercises.length})
          </div>

          {exercises.length === 0 ? (
            <div
              className="text-center py-6 border border-dashed rounded-2xl"
              style={{ borderColor: "#007991" }}
            >
              <Activity className="w-6 h-6 mx-auto mb-1.5 text-[#97EFE9] opacity-60" />
              <p className="text-xs text-[#97EFE9]/80 font-medium">
                No exercises logged yet. Log an activity above to track physical habits.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {exercises.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border text-xs transition-all shadow-xs"
                  style={{
                    backgroundColor: "#0D1424",
                    borderColor: "#007991",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
                    >
                      <Flame className="w-4 h-4 text-[#007991]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[#97EFE9]">
                        <span className="font-bold">{item.durationMinutes} mins</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="font-semibold text-white">{item.intensity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#97EFE9]/70">
                      {item.timestamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExercise(item.id)}
                      className="p-1 rounded-lg hover:opacity-75 transition-opacity cursor-pointer text-[#97EFE9]"
                      title="Delete logged exercise"
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
      <div className="mt-5 pt-3 border-t border-[#007991]/30 flex items-center justify-between text-xs">
        <span className="text-[#97EFE9]/80 font-medium">Blank initial state</span>
        <button
          type="button"
          onClick={onClearExercises}
          disabled={exercises.length === 0}
          className="flex items-center gap-1 font-bold text-[#97EFE9] hover:underline cursor-pointer disabled:opacity-30"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#97EFE9]" />
          Clear Exercises
        </button>
      </div>
    </div>
  );
};
