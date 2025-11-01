"use client";

import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, title = "Modal Title" }) {
  const bgColor = "#0D1117";   // dark card background
  const textColor = "#00E5FF"; // glowing cyan text

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6">
      <div
        className="relative w-full max-w-2xl sm:max-h-[90vh] h-auto rounded-2xl shadow-[0_0_25px_#00E5FF50] border overflow-hidden transition-all duration-300 flex flex-col"
        style={{
          backgroundColor: bgColor,
          borderColor: textColor,
        }}
      >
        {/* Header Section */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b"
          style={{ borderColor: textColor }}
        >
          <h2
            className="text-base sm:text-lg font-semibold tracking-wide truncate"
            style={{
              color: textColor,
              textShadow: `0 0 6px ${textColor}`,
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all hover:scale-110"
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.15)",
              color: "#FF4C4C",
              border: "1px solid #FF4C4C",
              boxShadow: "0 0 10px #FF4C4C",
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          className="overflow-y-auto flex-1"
          style={{
            color: textColor,
            maxHeight: "calc(90vh - 70px)", // keep header visible on small screens
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
