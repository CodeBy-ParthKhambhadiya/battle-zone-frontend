"use client";

import React from "react";
import { getRandomColor } from "@/components/getColor";

export default function ConfirmModal({
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  colorKey,
  style = {}, // optional custom style for positioning
}) {
  const { bgColor, textColor } = getRandomColor() || { bgColor: "#fff", textColor: "#000" };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={style} // allows custom positioning
    >
      <div
        className="rounded-lg w-full max-w-xs sm:max-w-md shadow-xl overflow-hidden flex flex-col"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Header */}
        <div
          className="p-4 font-bold text-lg sm:text-xl"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {title}
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 text-sm sm:text-base">
          <p>{message}</p>
        </div>

        {/* Footer / Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t border-gray-300">
          <button
            className="px-3 py-2 rounded font-medium transition bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-2 rounded font-medium transition bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
