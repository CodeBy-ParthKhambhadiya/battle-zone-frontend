"use client";

import React from "react";
import { Loader } from "lucide-react"; // spinner icon

export default function LoaderIcon({
  size = 20,
  colorClass = "text-[#00E5FF]", // default to your neon cyan
  className = "",
}) {
  return (
    <Loader
      className={`animate-spin mr-2 ${colorClass} ${className}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        filter: "drop-shadow(0 0 6px #00E5FF)", // subtle glow
      }}
      aria-hidden="true"
    />
  );
}
