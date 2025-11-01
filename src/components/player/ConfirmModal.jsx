
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
        className="rounded-lg w-full max-w-xs sm:max-w-md overflow-hidden flex flex-col border"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: textColor,
          boxShadow: `0 0 12px ${textColor}`,
        }}
      >
        {/* Header */}
        <div className="p-4 font-bold text-lg sm:text-xl">{title}</div>

        {/* Body */}
        <div className="p-4 text-sm sm:text-base">
          <div className="text-sm sm:text-base">{message}</div>
        </div>

        {/* Footer / Buttons */}
        {/* Footer / Buttons */}
        <div
          className="flex flex-row justify-end gap-2 p-4 border-t"
          style={{ borderColor: "#1f2937" }}
        >
          <button
            className="px-3 py-2 rounded font-medium transition"
            style={{
              backgroundColor: "#1E293B",
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
            className="px-3 py-2 rounded font-medium transition"
            style={{
              backgroundColor: textColor,
              color: bgColor,
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
