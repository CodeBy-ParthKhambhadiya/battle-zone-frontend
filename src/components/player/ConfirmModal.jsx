
    // const { bgColor, textColor } = getRandomColor() || { bgColor: "#fff", textColor: "#000" };
"use client";

import React from "react";

export default function ConfirmModal({
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  style = {},
}) {
  const bgColor = "#0D1117";   // dark card background
  const textColor = "#00E5FF"; // glowing cyan text

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={style}
    >
      <div
        className="rounded-lg w-full max-w-xs sm:max-w-md overflow-hidden flex flex-col"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          boxShadow: "0 0 40px 15px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Header */}
        <div className="p-4 font-bold text-lg sm:text-xl">{title}</div>

        {/* Body */}
        <div className="p-4 text-sm sm:text-base">
          <p>{message}</p>
        </div>

        {/* Footer / Buttons */}
        <div
          className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t"
          style={{ borderColor: "#1f2937" }} // subtle dark border
        >
          <button
            className="px-3 py-2 rounded font-medium transition w-full sm:w-auto"
            style={{
              backgroundColor: "#1E293B", // deep slate button
              color: textColor,
              border: `1px solid ${textColor}`,
            }}
            onClick={onCancel}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#111827")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1E293B")
            }
          >
            {cancelText}
          </button>

          <button
            className="px-3 py-2 rounded font-medium transition w-full sm:w-auto"
            style={{
              backgroundColor: textColor, // cyan main button
              color: bgColor,             // invert for contrast
            }}
            onClick={onConfirm}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#33F0FF")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = textColor)
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
