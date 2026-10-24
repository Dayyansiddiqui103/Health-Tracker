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
            <ListChecks className="w-6 h-6 text-[#97EFE9]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
              Daily Checklist
            </h2>
            <p className="text-xs md:text-sm font-medium text-[#97EFE9]">
              Check off completed goals and track what still needs to be done.
            </p>
          </div>
        </div>

        {/* Counters & Progress badge */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border"
            style={{
              backgroundColor: "#162038",
              borderColor: "#007991",
              color: "#97EFE9",
            }}
          >
            <span>{completedItems.length} Done</span>
            <span>•</span>
            <span className="text-white">{pendingItems.length} To-Do</span>
          </div>

          <div
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-md"
            style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
          >
            {percentCompleted}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {items.length > 0 && (
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5 font-bold text-[#97EFE9]">
            <span>Checklist Progress: {completedItems.length} of {items.length} tasks</span>
            <span>{percentCompleted}%</span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden border border-[#007991]"
            style={{ backgroundColor: "#0D1424" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${percentCompleted}%`,
                background: "linear-gradient(90deg, #007991 0%, #97EFE9 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs & Quick Add Task Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        {/* Filter Tabs */}
        <div
          className="flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-xs"
          style={{
            borderColor: "#007991",
            backgroundColor: "#0D1424",
          }}
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: filter === "all" ? "#97EFE9" : "transparent",
              color: filter === "all" ? "#222E50" : "#FFFFFF",
            }}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: filter === "pending" ? "#97EFE9" : "transparent",
              color: filter === "pending" ? "#222E50" : "#FFFFFF",
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            To-Do ({pendingItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: filter === "completed" ? "#97EFE9" : "transparent",
              color: filter === "completed" ? "#222E50" : "#FFFFFF",
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
            placeholder="Add habit (e.g. 10m stretch, fruit snack)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="text-xs md:text-sm px-3.5 py-2.5 rounded-xl border focus-ring w-full sm:w-72 text-white font-medium"
            style={{
              backgroundColor: "#0D1424",
              borderColor: "#007991",
            }}
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
          >
            <Plus className="w-4 h-4 text-[#222E50]" />
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="mt-5">
        {items.length === 0 ? (
          <div
            className="text-center py-12 px-4 border border-dashed rounded-2xl"
            style={{ borderColor: "#007991" }}
          >
            <ListChecks className="w-10 h-10 mx-auto mb-2 text-[#97EFE9] opacity-60" />
            <p className="text-base font-extrabold mb-1 text-white">
              Checklist is currently blank
            </p>
            <p className="text-xs max-w-md mx-auto text-[#97EFE9]">
              Set your goals in the Daily Planner tab or add custom tasks above to build your daily checklist.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className="text-center py-8 rounded-xl border border-dashed"
            style={{ borderColor: "#007991" }}
          >
            <p className="text-xs text-[#97EFE9]">
              No tasks found in the &ldquo;{filter}&rdquo; filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.completed ? "opacity-75" : "hover:border-[#97EFE9]"
                }`}
                style={{
                  backgroundColor: item.completed ? "#0D1424" : "#162038",
                  borderColor: item.completed ? "#007991" : "#007991",
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
                      <CheckSquare className="w-5 h-5 text-[#97EFE9]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#007991]" />
                    )}
                  </button>
                  <div>
                    <span
                      className={`text-xs md:text-sm font-bold transition-all ${
                        item.completed ? "line-through text-[#97EFE9]/60" : "text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.completedAt && (
                      <span className="block text-[10px] mt-0.5 text-[#97EFE9]/70 font-medium">
                        Completed at {item.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Category badge & Delete */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "#97EFE9",
                      color: "#222E50",
                    }}
                  >
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg hover:opacity-75 transition-opacity cursor-pointer text-[#97EFE9]"
                    title="Delete task"
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
