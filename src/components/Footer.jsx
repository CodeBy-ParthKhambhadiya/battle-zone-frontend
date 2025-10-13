"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1E3A8A] text-white p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <p className="text-sm">&copy; {new Date().getFullYear()} BattleZone. All rights reserved.</p>

        {/* Right side: Links */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="text-white hover:text-[#047857] transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-white hover:text-[#047857] transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-white hover:text-[#DC2626] transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
