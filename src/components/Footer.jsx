"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D1117] border-t border-cyan-500/30 text-[#00E5FF] py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Left side: Brand + Rights */}
        <div className="text-center md:text-left text-sm text-gray-400">
          © {year} <span className="text-cyan-400 font-semibold">BattleZone</span>. All rights reserved.
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="#"
            className="hover:text-cyan-400 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-cyan-400 transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="mailto:battlezoneofficial@gmail.com"
            className="hover:text-cyan-400 transition-colors duration-200"
          >
            Contact: battlezoneofficial@gmail.com
          </a>
        </div>

        {/* Right side: Admin Access */}
        <div className="text-center md:text-right">
          <Link
            href="/auth/admin-login"
            className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
