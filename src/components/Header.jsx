"use client";
import React, { useState } from "react";
import SignUpPopup from "./auth/SignUpPopup";
import LoginPopup from "./auth/LoginPopup";
import ForgotPassword from "./auth/ForgotPassword";
import { HiMenu, HiX } from "react-icons/hi";
import ForgotPasswordPopup from "./auth/ForgotPassword";

const Header = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const loginColor = "#333333";       // Medium-dark gray
    const loginHover = "#1F1F1F";       // Darker gray
    const signupColor = "#34D399";      // Soft green
    const signupHover = "#059669";      // Deep green for contrast

    return (
        <header className="p-4 flex justify-between items-center bg-[#252525] shadow-md relative">
            <div className="text-2xl font-bold text-white">BattleZone</div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex rounded-full overflow-hidden shadow-md">
                {/* Login Button */}
                <button
                    className="px-6 py-2 transition-all duration-200 cursor-pointer text-white font-medium"
                    style={{ backgroundColor: loginColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = loginHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = loginColor)}
                    onClick={() => setShowLogin(true)}
                >
                    Login
                </button>

                {/* Divider */}
                <span className="bg-gray-200 w-[1px]"></span>

                {/* Signup Button */}
                <button
                    className="px-6 py-2 transition-all duration-200 cursor-pointer text-white font-medium"
                    style={{ backgroundColor: signupColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = signupHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = signupColor)}
                    onClick={() => setShowSignup(true)}
                >
                    Signup
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <HiX size={24} color="white" /> : <HiMenu size={24} color="white" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-[#252525] shadow-md flex flex-col items-center py-4 space-y-3 md:hidden z-50">
                    <button
                        className="w-3/4 px-6 py-2 rounded-full text-white transition-all duration-200 cursor-pointer"
                        style={{ backgroundColor: loginColor }}
                        onClick={() => {
                            setShowLogin(true);
                            setMobileMenuOpen(false);
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="w-3/4 px-6 py-2 rounded-full text-white transition-all duration-200 cursor-pointer"
                        style={{ backgroundColor: signupColor }}
                        onClick={() => {
                            setShowSignup(true);
                            setMobileMenuOpen(false);
                        }}
                    >
                        Signup
                    </button>
                </div>
            )}

            {/* Render Popups */}{/* Render Popups */}
            {showSignup && (
                <SignUpPopup
                    onClose={() => setShowSignup(false)}
                    onShowLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}
            {showLogin && (
                <LoginPopup
                    onClose={() => setShowLogin(false)}
                    onShowSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                    onShowForgot={() => {
                        setShowLogin(false);
                        setShowForgot(true);
                    }}
                />
            )}
            {showForgot && (
                <ForgotPasswordPopup
                    onClose={() => setShowForgot(false)} // <-- this fixes the crash
                    onShowLogin={() => {
                        setShowForgot(false);
                        setShowLogin(true);
                    }}
                    onShowSignup={() => {
                        setShowForgot(false);
                        setShowSignup(true);
                    }}
                />
            )}

        </header>
    );
};

export default Header;
