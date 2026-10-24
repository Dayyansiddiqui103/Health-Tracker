"use client";

import React, { useState, useEffect, useRef } from "react";
import { HealthData, ChatMessage } from "../types";
import {
  Bot,
  Send,
  Sparkles,
  Key,
  RotateCcw,
  ExternalLink,
  Check,
  Lightbulb,
} from "lucide-react";

interface AIChatCoachProps {
  data: HealthData;
  isDarkMode: boolean;
}

const STORAGE_KEY_GEMINI = "student_gemini_api_key_v1";
const STORAGE_KEY_CHAT = "student_gemini_chat_history_v1";

const SUGGESTED_PROMPTS = [
  "How is my overall health balance today?",
  "Suggest a 10-minute study break stretch",
  "How can I improve my sleep after late studying?",
  "Brain foods to eat during exam revision",
  "How much more water should I drink today?",
];

let globalMsgCounter = 0;
function createMessageId(prefix: string): string {
  globalMsgCounter += 1;
  return `${prefix}-${globalMsgCounter}-${Math.random().toString(36).substring(2, 8)}`;
}

function getCurrentTimeStr(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const AIChatCoach: React.FC<AIChatCoachProps> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [keySavedToast, setKeySavedToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key and initial chat messages on mount asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedKey = localStorage.getItem(STORAGE_KEY_GEMINI) || "";
        setApiKey(savedKey);
        setTempKey(savedKey);

        const savedChat = localStorage.getItem(STORAGE_KEY_CHAT);
        if (savedChat) {
          setMessages(JSON.parse(savedChat));
        } else {
          // Welcoming initial message
          setMessages([
            {
              id: "initial-welcome",
              role: "assistant",
              content:
                "👋 Hi! I'm your **AI Health & Wellness Coach** powered by Google Gemini. I have access to your logged water, sleep, exercise, and daily habits for today. Ask me anything, or pick one of the quick suggestions below!",
              timestamp: getCurrentTimeStr(),
            },
          ]);
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save chat to localStorage when messages update
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKey.trim();
    setApiKey(cleanKey);
    localStorage.setItem(STORAGE_KEY_GEMINI, cleanKey);
    setShowKeyModal(false);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
  };

  const handleClearChat = () => {
    const fresh: ChatMessage[] = [
      {
        id: createMessageId("fresh"),
        role: "assistant",
        content:
          "✨ Chat cleared! I'm ready to help you plan healthy habits, workouts, or recovery for your studies. What's on your mind?",
        timestamp: getCurrentTimeStr(),
      },
    ];
    setMessages(fresh);
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(fresh));
  };

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: textToSend,
      timestamp: getCurrentTimeStr(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    // Compute student health context
    const completedTasks = data.checklist.filter((t) => t.completed).length;
    const totalExerciseMinutes = data.exercises.reduce((sum, e) => sum + e.durationMinutes, 0);

    const healthContext = {
      waterGlasses: data.waterGlasses,
      waterGoal: data.plan.waterGoalGlasses || 8,
      sleepHours: data.sleep.hours || "",
      sleepQuality: data.sleep.quality || "",
      bedTime: data.sleep.bedTime || "",
      wakeTime: data.sleep.wakeTime || "",
      exerciseMinutes: totalExerciseMinutes,
      exercisesCount: data.exercises.length,
      completedTasks,
      totalTasks: data.checklist.length,
      focusNote: data.plan.focusNote,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          healthContext,
          apiKey: apiKey || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.error || "Failed to reach Gemini API");
      }

      const botMsg: ChatMessage = {
        id: createMessageId("bot"),
        role: "assistant",
        content: resData.reply || "I'm here to support your daily wellness goals!",
        timestamp: getCurrentTimeStr(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      const errorBotMsg: ChatMessage = {
        id: createMessageId("err"),
        role: "assistant",
        content: `⚠️ **Error connecting to AI:** ${errorMsg}.\n\nPlease ensure your Google Gemini API key is valid. You can set it using the 'Gemini API Key' button above.`,
        timestamp: getCurrentTimeStr(),
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = data.checklist.filter((t) => t.completed).length;
  const totalWorkoutMins = data.exercises.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <section
      className="rounded-3xl p-6 md:p-8 transition-all border shadow-lg flex flex-col h-[750px]"
      style={{
        background: "linear-gradient(145deg, #18223C 0%, #222E50 100%)",
        borderColor: "#007991",
        boxShadow: "0 10px 30px rgba(0, 121, 145, 0.2)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#007991]/30 gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            style={{ backgroundColor: "#007991", border: "2px solid #97EFE9" }}
          >
            <Bot className="w-6 h-6 text-[#97EFE9]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                AI Health & Wellness Coach
              </h2>
              <span
                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#97EFE9", color: "#222E50" }}
              >
                Gemini 1.5 Flash
              </span>
            </div>
            <p className="text-xs text-[#97EFE9] font-medium">
              Context-aware student guidance for study energy, sleep, workouts & hydration
            </p>
          </div>
        </div>

        {/* Top Controls: API Key & Clear Chat */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            style={{
              backgroundColor: apiKey ? "#007991" : "#222E50",
              borderColor: "#97EFE9",
              color: "#FFFFFF",
            }}
            title="Configure your free Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#97EFE9]" />
            <span>{apiKey ? "Gemini Key Configured" : "Add Gemini API Key"}</span>
          </button>

          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            style={{
              backgroundColor: "#222E50",
              borderColor: "#007991",
              color: "#97EFE9",
            }}
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#97EFE9]" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Live Health Context Bar */}
      <div
        className="my-3 px-4 py-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(0, 121, 145, 0.25) 0%, rgba(34, 46, 80, 0.4) 100%)",
          borderColor: "#007991",
        }}
      >
        <div className="flex items-center gap-1.5 text-[#97EFE9] font-bold">
          <Sparkles className="w-4 h-4 text-[#97EFE9]" />
          <span>Real-time Health Context Linked:</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 text-[11px] font-semibold">
          <span>💧 {data.waterGlasses}/{data.plan.waterGoalGlasses || 8} glasses</span>
          <span>•</span>
          <span>😴 {data.sleep.hours || 0} hrs sleep</span>
          <span>•</span>
          <span>⚡ {totalWorkoutMins} mins workouts</span>
          <span>•</span>
          <span>✅ {completedCount}/{data.checklist.length} habits</span>
        </div>
      </div>

      {/* Toast Notification when Key is Saved */}
      {keySavedToast && (
        <div
          className="mb-2 px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-md shrink-0"
          style={{ backgroundColor: "#97EFE9", color: "#222E50", borderColor: "#FFFFFF" }}
        >
          <Check className="w-4 h-4 text-[#007991]" />
          <span>Gemini API Key saved successfully! Your chat is now powered by Gemini 1.5 Flash.</span>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2 scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                backgroundColor: msg.role === "user" ? "#007991" : "#222E50",
                border: "1.5px solid #97EFE9",
              }}
            >
              {msg.role === "user" ? (
                <span className="text-xs font-black text-white">YOU</span>
              ) : (
                <Bot className="w-4 h-4 text-[#97EFE9]" />
              )}
            </div>

            {/* Bubble */}
            <div
              className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-md text-xs sm:text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: "linear-gradient(135deg, #007991 0%, #005F73 100%)",
                      color: "#FFFFFF",
                      border: "1px solid #97EFE9",
                    }
                  : {
                      background: "linear-gradient(135deg, #1C2742 0%, #222E50 100%)",
                      color: "#FFFFFF",
                      border: "1px solid #007991",
                    }
              }
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-[10px] mt-1.5 opacity-60 text-right text-[#97EFE9]">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: "#222E50", border: "1.5px solid #97EFE9" }}
            >
              <Bot className="w-4 h-4 text-[#97EFE9] animate-pulse" />
            </div>
            <div
              className="rounded-2xl px-4 py-3 border shadow-md flex items-center gap-1.5"
              style={{
                backgroundColor: "#1C2742",
                borderColor: "#007991",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#97EFE9] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#97EFE9] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#97EFE9] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="pt-2 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#97EFE9] mb-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Quick prompts:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-xl border text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
              style={{
                backgroundColor: "#182644",
                borderColor: "#007991",
                color: "#97EFE9",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#007991]/30 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for workout ideas, sleep advice, exam wellness tips..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none border transition-all shadow-inner focus:border-[#97EFE9]"
          style={{
            backgroundColor: "#131D33",
            borderColor: "#007991",
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md cursor-pointer shrink-0"
          style={{
            backgroundColor: "#97EFE9",
            color: "#222E50",
          }}
        >
          <Send className="w-4 h-4 text-[#007991]" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #18223C 0%, #222E50 100%)",
              borderColor: "#97EFE9",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#007991]/40 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#97EFE9]" />
                <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/90 leading-relaxed mb-3">
              Google provides a <strong>100% free Gemini API key</strong> for developers and students with generous daily rate limits.
            </p>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#97EFE9] underline hover:opacity-80 mb-4"
            >
              <span>Get your free Gemini Key from Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <form onSubmit={handleSaveKey}>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#97EFE9] mb-1.5">
                Paste Gemini API Key:
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-400 border outline-none mb-4"
                style={{
                  backgroundColor: "#131D33",
                  borderColor: "#007991",
                }}
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "#97EFE9",
                    color: "#222E50",
                  }}
                >
                  <Check className="w-3.5 h-3.5 text-[#007991]" />
                  <span>Save Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
