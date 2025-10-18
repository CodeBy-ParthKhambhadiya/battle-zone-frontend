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
console.log("new");

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            style={{
                // backgroundColor: "rgba(0, 0, 0, 0.4)", // optional: darken backdrop
                ...style,
            }}
        >
            <div
                className="rounded-lg w-full max-w-xs sm:max-w-md overflow-hidden flex flex-col"
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    boxShadow: "0 0 40px 15px rgba(0, 0, 0, 0.8)", // strong dark shadow on all sides
                }}
            >
                {/* Header */}
                <div
                    className="p-4 font-bold text-lg sm:text-xl"
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    {title}
                </div>

                {/* Body */}
                <div
                    className="p-4 text-sm sm:text-base"
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    <p>{message}</p>
                </div>

                {/* Footer / Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t border-gray-300">
                    <button
                        className="px-3 py-2 rounded font-medium transition bg-gray-200 hover:bg-gray-300 w-full cursor-pointer sm:w-auto"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-3 py-2 rounded font-medium transition bg-blue-600 text-white hover:bg-blue-700 w-full cursor-pointer sm:w-auto"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
