"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className="p-4 flex justify-between items-center relative"
            style={{ backgroundColor: "var(--header-bg)", color: "var(--header-text)" }}
        >
            {/* Logo */}
            <div className="text-2xl font-bold">
                <Link href="/">BattleZone</Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex rounded-full overflow-hidden shadow-md">
                {/* Login */}
                <Link
                    href="/auth/login"
                    className="px-6 py-2 font-medium transition-all duration-200 cursor-pointer
               bg-[var(--primary)] text-[var(--header-text)]
               hover:bg-black hover:text-white"
                >
                    Login
                </Link>

                {/* Divider */}
                <span className="w-[1px] bg-[var(--border)]"></span>

                {/* Signup */}
                <Link
                    href="/auth/signup"
                    className="px-6 py-2 font-medium transition-all duration-200 cursor-pointer
               bg-[var(--signup-bg)] text-[var(--signup-text)]
                hover:bg-[#23c0ae] hover:text-white"
                >
                    Signup
                </Link>
            </div>



            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="absolute top-16 left-0 w-full flex flex-col items-center py-4 space-y-3 md:hidden shadow-md"
                    style={{ backgroundColor: "var(--header-bg)" }}
                >
                    <Link
                        href="/auth/login"
                        className="w-3/4 px-6 py-2 rounded-full text-[var(--header-text)] font-medium transition-all duration-200 cursor-pointer text-center"
                        style={{ backgroundColor: "var(--primary)" }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="w-3/4 px-6 py-2 rounded-full text-[var(--signup-text)] font-medium transition-all duration-200 cursor-pointer text-center"
                        style={{ backgroundColor: "var(--signup-bg)" }}
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
