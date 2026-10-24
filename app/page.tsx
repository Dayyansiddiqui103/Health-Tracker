"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { HealthData, DailyPlan, LoggedExercise, ChecklistItem, SleepLog } from "./types";
import { Header } from "./components/Header";
import { TabsNav, TabType } from "./components/TabsNav";
import { DailyPlanner } from "./components/DailyPlanner";
import { DailyChecklist } from "./components/DailyChecklist";
import { WaterTracker } from "./components/WaterTracker";
import { SleepTracker } from "./components/SleepTracker";
import { ExerciseTracker } from "./components/ExerciseTracker";
import { DailySummary } from "./components/DailySummary";
import { ResetModal } from "./components/ResetModal";
import { ArrowRight, Sparkles } from "lucide-react";

const STORAGE_KEY = "student_health_tracker_data_v4";
const THEME_KEY = "student_health_tracker_theme_v4";

// Pristine blank initial state with NO pre-filled dummy data
const getInitialBlankData = (): HealthData => ({
  plan: {
    date: "",
    waterGoalGlasses: "",
    sleepGoalHours: "",
    focusNote: "",
    plannedExercises: [],
    isPlanSaved: false,
  },
  waterGlasses: 0,
  sleep: {
    hours: "",
    bedTime: "",
    wakeTime: "",
    quality: "",
    notes: "",
  },
  exercises: [],
  checklist: [],
});

export default function Home() {
  const [data, setData] = useState<HealthData>(getInitialBlankData);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("planner");

  // Load saved theme and data from localStorage on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const isDark = savedTheme === "dark";
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        setIsDarkMode(isDark);

        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      } catch (err) {
        console.error("Failed to load local storage:", err);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save data to localStorage whenever updated
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save local storage:", err);
    }
  }, [data, isLoaded]);

  // Handle Theme Toggle
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      }
      return nextTheme;
    });
  };

  // Trigger celebratory confetti when all tasks completed
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#97EFE9", "#007991", "#222E50"],
    });
  };

  // Daily Planner: update plan and synchronize checklist items
  const handleUpdatePlan = (newPlan: DailyPlan) => {
    const updatedChecklist = [...data.checklist];

    // 1. Water target checklist item
    const waterGoalNum = Number(newPlan.waterGoalGlasses);
    if (waterGoalNum > 0) {
      const existingWaterTaskIdx = updatedChecklist.findIndex((t) => t.category === "water");
      const isWaterMet = data.waterGlasses >= waterGoalNum;
      const title = `Drink ${waterGoalNum} glasses of water (Current: ${data.waterGlasses}/${waterGoalNum})`;

      if (existingWaterTaskIdx >= 0) {
        updatedChecklist[existingWaterTaskIdx] = {
          ...updatedChecklist[existingWaterTaskIdx],
          title,
          completed: isWaterMet || updatedChecklist[existingWaterTaskIdx].completed,
        };
      } else {
        updatedChecklist.push({
          id: "task-water-goal",
          title,
          category: "water",
          completed: isWaterMet,
          relatedTarget: `${waterGoalNum} glasses`,
        });
      }
    }

    // 2. Sleep target checklist item
    const sleepGoalNum = Number(newPlan.sleepGoalHours);
    if (sleepGoalNum > 0) {
      const existingSleepTaskIdx = updatedChecklist.findIndex((t) => t.category === "sleep");
      const currentSleep = Number(data.sleep.hours) || 0;
      const isSleepMet = currentSleep >= sleepGoalNum;
      const title = `Get ${sleepGoalNum} hours of sleep (Logged: ${currentSleep}h)`;

      if (existingSleepTaskIdx >= 0) {
        updatedChecklist[existingSleepTaskIdx] = {
          ...updatedChecklist[existingSleepTaskIdx],
          title,
          completed: isSleepMet || updatedChecklist[existingSleepTaskIdx].completed,
        };
      } else {
        updatedChecklist.push({
          id: "task-sleep-goal",
          title,
          category: "sleep",
          completed: isSleepMet,
          relatedTarget: `${sleepGoalNum} hours`,
        });
      }
    }

    // 3. Planned exercises checklist items
    newPlan.plannedExercises.forEach((pe) => {
      const existingTask = updatedChecklist.find((t) => t.id === `task-pe-${pe.id}`);
      if (!existingTask) {
        updatedChecklist.push({
          id: `task-pe-${pe.id}`,
          title: `Workout: ${pe.name} (${pe.durationMinutes} mins - ${pe.category})`,
          category: "exercise",
          completed: false,
        });
      }
    });

    setData({
      ...data,
      plan: newPlan,
      checklist: updatedChecklist,
    });
  };

  // Water Tracker: increment or set water count
  const handleUpdateWater = (glasses: number) => {
    const updatedChecklist = data.checklist.map((task) => {
      if (task.category === "water") {
        const waterGoalNum = Number(data.plan.waterGoalGlasses) || 8;
        const isMet = glasses >= waterGoalNum;
        return {
          ...task,
          title: `Drink ${waterGoalNum} glasses of water (Current: ${glasses}/${waterGoalNum})`,
          completed: isMet,
          completedAt: isMet ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
        };
      }
      return task;
    });

    setData({
      ...data,
      waterGlasses: glasses,
      checklist: updatedChecklist,
    });
  };

  // Sleep Tracker: update sleep log
  const handleUpdateSleep = (newSleep: SleepLog) => {
    const updatedChecklist = data.checklist.map((task) => {
      if (task.category === "sleep") {
        const sleepGoalNum = Number(data.plan.sleepGoalHours) || 8;
        const actualHours = Number(newSleep.hours) || 0;
        const isMet = actualHours >= sleepGoalNum && actualHours > 0;
        return {
          ...task,
          title: `Get ${sleepGoalNum} hours of sleep (Logged: ${actualHours}h)`,
          completed: isMet,
          completedAt: isMet ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
        };
      }
      return task;
    });

    setData({
      ...data,
      sleep: newSleep,
      checklist: updatedChecklist,
    });
  };

  // Exercise Tracker: add logged exercise
  const handleAddExercise = (exerciseInput: Omit<LoggedExercise, "id" | "timestamp">) => {
    const newExercise: LoggedExercise = {
      ...exerciseInput,
      id: "ex-" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedChecklist = [...data.checklist];
    const matchingPlanTask = updatedChecklist.find(
      (t) => t.category === "exercise" && !t.completed && t.title.toLowerCase().includes(exerciseInput.name.toLowerCase())
    );

    if (matchingPlanTask) {
      matchingPlanTask.completed = true;
      matchingPlanTask.completedAt = newExercise.timestamp;
    } else {
      updatedChecklist.push({
        id: "task-completed-ex-" + newExercise.id,
        title: `Completed ${exerciseInput.name} (${exerciseInput.durationMinutes}m)`,
        category: "exercise",
        completed: true,
        completedAt: newExercise.timestamp,
      });
    }

    setData({
      ...data,
      exercises: [newExercise, ...data.exercises],
      checklist: updatedChecklist,
    });
  };

  // Exercise Tracker: delete logged exercise
  const handleDeleteExercise = (id: string) => {
    setData({
      ...data,
      exercises: data.exercises.filter((e) => e.id !== id),
    });
  };

  // Exercise Tracker: clear all exercises
  const handleClearExercises = () => {
    setData({
      ...data,
      exercises: [],
    });
  };

  // Checklist: toggle task completed status
  const handleToggleChecklistItem = (id: string) => {
    let allJustCompleted = false;

    const updatedChecklist = data.checklist.map((item) => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        return {
          ...item,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
        };
      }
      return item;
    });

    const completedCount = updatedChecklist.filter((t) => t.completed).length;
    if (completedCount === updatedChecklist.length && updatedChecklist.length > 0) {
      allJustCompleted = true;
    }

    setData({
      ...data,
      checklist: updatedChecklist,
    });

    if (allJustCompleted) {
      triggerConfetti();
    }
  };

  // Checklist: add custom student task
  const handleAddCustomChecklistItem = (title: string, category: ChecklistItem["category"]) => {
    const newItem: ChecklistItem = {
      id: "task-custom-" + Date.now(),
      title,
      category,
      completed: false,
    };

    setData({
      ...data,
      checklist: [...data.checklist, newItem],
    });
  };

  // Checklist: delete task
  const handleDeleteChecklistItem = (id: string) => {
    setData({
      ...data,
      checklist: data.checklist.filter((t) => t.id !== id),
    });
  };

  // Reset all data to pristine blank slate
  const handleResetAllData = () => {
    const fresh = getInitialBlankData();
    setData(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = data.checklist.filter((i) => i.completed).length;
  const totalCount = data.checklist.length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB] text-[#222E50]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#007991] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading Student Health Tracker...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* 1. Ultra-Clean Top Navbar (No tabs, just logo & theme toggle) */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Tabs Moved Below Navbar (Clean segmented control) */}
      <TabsNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isDarkMode={isDarkMode}
        completionRate={completionRate}
        pendingTasksCount={pendingCount}
      />

      {/* 3. Main Container - Clean Tabbed View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-10">
        {/* TAB 1: Daily Planner */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            <DailyPlanner
              plan={data.plan}
              onUpdatePlan={handleUpdatePlan}
              isDarkMode={isDarkMode}
            />

            {/* Quick Next Step Helper */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("trackers")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
              >
                <span>Continue to Health Trackers</span>
                <ArrowRight className="w-4 h-4 text-[#97EFE9]" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive Health Trackers */}
        {activeTab === "trackers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Water Tracker with Animated Liquid Glass */}
              <WaterTracker
                waterGlasses={data.waterGlasses}
                goalGlasses={data.plan.waterGoalGlasses}
                onUpdateWater={handleUpdateWater}
                isDarkMode={isDarkMode}
              />

              {/* Sleep Tracker */}
              <SleepTracker
                sleep={data.sleep}
                goalHours={data.plan.sleepGoalHours}
                onUpdateSleep={handleUpdateSleep}
                isDarkMode={isDarkMode}
              />

              {/* Exercise Tracker */}
              <ExerciseTracker
                exercises={data.exercises}
                onAddExercise={handleAddExercise}
                onDeleteExercise={handleDeleteExercise}
                onClearExercises={handleClearExercises}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("planner")}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all hover:opacity-85 cursor-pointer"
                style={{
                  borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                  color: isDarkMode ? "#F8FAFC" : "#222E50",
                  backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
                }}
              >
                ← Back to Planner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
              >
                <span>View Daily Checklist</span>
                <ArrowRight className="w-4 h-4 text-[#97EFE9]" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Daily Checklist */}
        {activeTab === "checklist" && (
          <div className="space-y-6">
            <DailyChecklist
              items={data.checklist}
              onToggleItem={handleToggleChecklistItem}
              onAddItem={handleAddCustomChecklistItem}
              onDeleteItem={handleDeleteChecklistItem}
              isDarkMode={isDarkMode}
            />

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("trackers")}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all hover:opacity-85 cursor-pointer"
                style={{
                  borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                  color: isDarkMode ? "#F8FAFC" : "#222E50",
                  backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
                }}
              >
                ← Back to Trackers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
                style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
              >
                <span>View Summary & Health Score</span>
                <ArrowRight className="w-4 h-4 text-[#97EFE9]" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Daily Overview & Summary */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <DailySummary
              data={data}
              isDarkMode={isDarkMode}
              onOpenResetModal={() => setIsResetModalOpen(true)}
            />

            <div className="flex justify-start pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all hover:opacity-85 cursor-pointer"
                style={{
                  borderColor: isDarkMode ? "#27375A" : "#CBD5E1",
                  color: isDarkMode ? "#F8FAFC" : "#222E50",
                  backgroundColor: isDarkMode ? "#172138" : "#FFFFFF",
                }}
              >
                ← Back to Checklist
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer
        className="mt-auto py-5 border-t text-center text-xs transition-colors"
        style={{
          borderColor: isDarkMode ? "#27375A" : "#E2E8F0",
          backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
          color: isDarkMode ? "#8699B8" : "#8496B3",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Student Health Tracker</p>
          <div className="flex items-center gap-2 font-medium" style={{ color: "#007991" }}>
            <Sparkles className="w-3.5 h-3.5 text-[#97EFE9]" />
            <span>Clean, simple wellness & focus</span>
          </div>
        </div>
      </footer>

      {/* Confirmation Modal to Reset to Pristine Blank State */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetAllData}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
