"use client";

import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl relative rounded-2xl shadow-2xl shadow-black/60 bg-white/10 border border-white/20 overflow-hidden">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all hover:scale-110 shadow-md cursor-pointer" 
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
