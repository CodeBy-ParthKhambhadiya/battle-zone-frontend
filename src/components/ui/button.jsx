"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  active = false, // for toggle button (Enable/Disable)
  className = "",
  ...props
}) => {
  // Your theme colors
  const bgColor = "#0D1117"; // dark background
  const textColor = "#00E5FF"; // glowing cyan

  const baseStyles = `
    inline-flex items-center justify-center rounded-2xl font-semibold 
    transition-all duration-300 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 shadow-md
  `;

  // Color variants with your theme colors
  const variants = {
    primary: `
      bg-[${bgColor}] text-[${textColor}] border border-[${textColor}] 
      hover:bg-[${textColor}] hover:text-black 
      focus:ring-[${textColor}]
    `,
    danger: `
      bg-[${bgColor}] text-red-400 border border-red-400 
      hover:bg-red-500 hover:text-white 
      focus:ring-red-400
    `,
    success: `
      bg-[${bgColor}] text-green-400 border border-green-400 
      hover:bg-green-500 hover:text-white 
      focus:ring-green-400
    `,
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getVariant = () => {
    if (variant === "toggle") {
      return active
        ? "bg-green-500 text-white border border-green-400 hover:bg-green-600"
        : "bg-red-500 text-white border border-red-400 hover:bg-red-600";
    }
    return variants[variant] || variants.primary;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${getVariant()}
        ${sizes[size]}
        ${disabled || loading ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        textShadow: `0 0 6px ${textColor}`,
        boxShadow: active
          ? `0 0 10px ${textColor}, 0 0 20px ${textColor}`
          : "0 0 6px rgba(0,0,0,0.5)",
      }}
      {...props}
    >
      {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};
