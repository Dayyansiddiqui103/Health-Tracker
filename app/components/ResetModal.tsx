"use client";

import React from "react";
import { AlertTriangle, X, RotateCcw } from "lucide-react";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-md p-6 rounded-2xl border shadow-2xl transition-all"
        style={{
          backgroundColor: isDarkMode ? "#1A233D" : "#FFFFFF",
          borderColor: "#007991",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:opacity-75 cursor-pointer"
          style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#222E50", border: "1.5px solid #007991" }}
          >
            <AlertTriangle className="w-5 h-5 text-[#97EFE9]" />
          </div>
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: isDarkMode ? "#F0FCFB" : "#222E50" }}
            >
              Reset to Blank State?
            </h3>
            <p className="text-xs" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
              Restore app to completely empty initial state
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm mb-6" style={{ color: isDarkMode ? "#8AA0C7" : "#3D4E75" }}>
          This will clear all your planned targets, water intake count, sleep logs, exercise entries, and checklist tasks back to 0/empty. This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              borderColor: isDarkMode ? "#2F3E68" : "#CBEFEE",
              color: isDarkMode ? "#97EFE9" : "#222E50",
              backgroundColor: isDarkMode ? "#131B30" : "#F4FBFB",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            style={{ backgroundColor: "#007991", color: "#FFFFFF" }}
          >
            <RotateCcw className="w-4 h-4 text-[#97EFE9]" />
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
