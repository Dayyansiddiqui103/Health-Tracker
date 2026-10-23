"use client";

import React, { useState } from "react";
import { ChecklistItem } from "../types";
import { CheckSquare, Square, CheckCircle2, Clock, Plus, Trash2, ListChecks } from "lucide-react";

interface DailyChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (title: string, category: ChecklistItem["category"]) => void;
  onDeleteItem: (id: string) => void;
  isDarkMode: boolean;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  isDarkMode,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<ChecklistItem["category"]>("custom");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddItem(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle("");
  };

  const completedItems = items.filter((item) => item.completed);
  const pendingItems = items.filter((item) => !item.completed);

  const filteredItems = items.filter((item) => {
    if (filter === "completed") return item.completed;
    if (filter === "pending") return !item.completed;
    return true;
  });

  const percentCompleted = items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0;

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
            <ListChecks className="w-5 h-5 text-[#007991]" />
          </div>
          <div>
            <h2
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
            >
              Daily Checklist
            </h2>
            <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Check off completed goals and track what still needs to be done.
            </p>
          </div>
        </div>

        {/* Counters & Progress badge */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: isDarkMode ? "#172138" : "#F1F5F8",
              color: isDarkMode ? "#97EFE9" : "#222E50",
              border: isDarkMode ? "1px solid #27375A" : "1px solid #E2E8F0",
            }}
          >
            <span>{completedItems.length} Done</span>
            <span>•</span>
            <span>{pendingItems.length} To-Do</span>
          </div>

          <div
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs"
            style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
          >
            {percentCompleted}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {items.length > 0 && (
        <div className="mt-5">
          <div
            className="flex justify-between text-xs mb-1.5 font-medium"
            style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}
          >
            <span>Checklist Progress: {completedItems.length} of {items.length} tasks</span>
            <span>{percentCompleted}%</span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: isDarkMode ? "#0F172A" : "#E2E8F0" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${percentCompleted}%`,
                backgroundColor: "#007991",
              }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs & Quick Add Task Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        {/* Filter Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border"
          style={{
            borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
            backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
          }}
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: filter === "all" ? "#007991" : "transparent",
              color: filter === "all" ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
            }}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: filter === "pending" ? "#007991" : "transparent",
              color: filter === "pending" ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            To-Do ({pendingItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: filter === "completed" ? "#007991" : "transparent",
              color: filter === "completed" ? "#FFFFFF" : isDarkMode ? "#8699B8" : "#4A5B7D",
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed ({completedItems.length})
          </button>
        </div>

        {/* Add Custom Task Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add habit (e.g. 10m eye rest, healthy snack)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="text-xs md:text-sm px-3.5 py-2 rounded-xl border focus-ring w-full sm:w-72"
            style={{
              backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
              borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
              color: isDarkMode ? "#F8FAFC" : "#222E50",
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
          >
            <Plus className="w-4 h-4 text-[#97EFE9]" />
            Add Task
          </button>
        </form>
      </div>

      {/* Task List (Blank Initial State) */}
      <div className="mt-5">
        {items.length === 0 ? (
          <div
            className="text-center py-10 px-4 border border-dashed rounded-2xl"
            style={{ borderColor: isDarkMode ? "#27375A" : "#E2E8F0" }}
          >
            <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#007991]" />
            <p className="text-base font-bold mb-1" style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}>
              Checklist is currently blank
            </p>
            <p className="text-xs max-w-md mx-auto" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              Set your goals in the Daily Planner tab or add custom tasks above to build your daily checklist.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className="text-center py-8 rounded-xl border border-dashed"
            style={{ borderColor: isDarkMode ? "#27375A" : "#E2E8F0" }}
          >
            <p className="text-xs" style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}>
              No tasks found in the &ldquo;{filter}&rdquo; filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.completed ? "opacity-80" : "hover:border-[#007991]"
                }`}
                style={{
                  backgroundColor: item.completed
                    ? isDarkMode
                      ? "#0F172A"
                      : "#F8FAFC"
                    : isDarkMode
                    ? "#172138"
                    : "#FFFFFF",
                  borderColor: item.completed ? "#007991" : isDarkMode ? "#27375A" : "#E2E8F0",
                }}
              >
                {/* Left: Checkbox & Title */}
                <div
                  onClick={() => onToggleItem(item.id)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 select-none"
                >
                  <button
                    type="button"
                    aria-label={item.completed ? "Mark as pending" : "Mark as completed"}
                    className="transition-transform active:scale-90 cursor-pointer"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#007991]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#8699B8]" />
                    )}
                  </button>
                  <div>
                    <span
                      className={`text-xs md:text-sm font-medium transition-all ${
                        item.completed ? "line-through opacity-70" : ""
                      }`}
                      style={{ color: isDarkMode ? "#F8FAFC" : "#222E50" }}
                    >
                      {item.title}
                    </span>
                    {item.completedAt && (
                      <span
                        className="block text-[10px] mt-0.5"
                        style={{ color: isDarkMode ? "#8699B8" : "#8496B3" }}
                      >
                        Completed at {item.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Category badge & Delete */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isDarkMode ? "#222E50" : "#F1F5F8",
                      color: isDarkMode ? "#97EFE9" : "#007991",
                    }}
                  >
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                    title="Delete task"
                    style={{ color: "#007991" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
