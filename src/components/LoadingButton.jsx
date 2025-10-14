"use client";

import React from "react";
import { Loader } from "lucide-react"; // or any spinner icon

export default function LoaderIcon({ size = 4, colorClass = "text-[var(--signup-text)]", className = "" }) {
  return (
    <Loader
      className={`animate-spin mr-2 h-${size} w-${size} ${colorClass} ${className}`}
      aria-hidden="true"
    />
  );
}
