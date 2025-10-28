"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

const Header = ({ colors }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!colors) return null;

  return (
    <header
      className="p-4 flex justify-between items-center relative shadow-md transition-all duration-500"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
      }}
    >
      {/* Logo */}
      <div className="text-2xl font-bold transition-colors duration-300">
        <Link href="/" style={{ color: colors.textColor }}>
          BattleZone
        </Link>
      </div>

      {/* Desktop Buttons */}
<div
  className="hidden md:flex rounded-full overflow-hidden shadow-md border transition-all duration-300"
  style={{ borderColor: colors.textColor }}
>
  {/* Login */}
  <Link
    href="/auth/login"
    className="px-6 py-2 font-medium transition-all duration-300 cursor-pointer"
    style={{
      backgroundColor: colors.textColor,
      color: colors.bgColor,
    }}
   
  >
    Login
  </Link>

  <span
    className="w-[1px]"
    style={{ backgroundColor: colors.textColor }}
  ></span>

  {/* Signup */}
  <Link
    href="/auth/signup"
    className="px-6 py-2 font-medium transition-all duration-300 cursor-pointer"
    style={{
      backgroundColor: colors.bgColor,
      color: colors.textColor,
    }}
  
  >
    Signup
  </Link>
</div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: colors.textColor }}
        >
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="absolute top-16 left-0 w-full flex flex-col items-center py-4 space-y-3 md:hidden shadow-md transition-all duration-300"
          style={{ backgroundColor: colors.bgColor }}
        >
          <Link
            href="/auth/login"
            className="w-3/4 px-6 py-2 rounded-full font-medium text-center transition-all duration-300"
            style={{
              backgroundColor: colors.textColor,
              color: colors.bgColor,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="w-3/4 px-6 py-2 rounded-full font-medium text-center transition-all duration-300"
            style={{
              backgroundColor: colors.bgColor,
              color: colors.textColor,
              border: `1px solid ${colors.textColor}`,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
