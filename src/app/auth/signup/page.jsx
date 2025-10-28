"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { ChevronDown, Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Toast from "@/utils/toast";
import { useTheme } from "@/context/ThemeContext";

export default function SignupPage() {
  const router = useRouter();
  const { createUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    gender: "MALE",
    role: "PLAYER",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const roles = ["PLAYER", "ORGANIZER"];

  // 🔒 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧩 Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  // 🚨 Validation
  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile))
      newErrors.mobile = "Enter a valid 10-digit number";

    return newErrors;
  };

  // 🚀 Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.error("Please fix highlighted errors");
      return;
    }

    try {
      const result = await createUser(form);
      if (result.meta?.requestStatus === "fulfilled") {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error(err);
      Toast.error("Signup failed. Try again.");
    }
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? "red" : textColor,
    color: textColor,
    caretColor: textColor,
    backgroundColor: "transparent",
  });

  // 💫 Smooth fade animation style for errors
  const fadeClass =
    "transition-all duration-500 ease-in-out text-red-500 text-xs mt-1";

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-500"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex gap-3">
            <div className="w-1/2 relative">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
                style={inputStyle("firstName")}
              />
              <p
                className={`${fadeClass} ${
                  errors.firstName
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }`}
              >
                {errors.firstName || ""}
              </p>
            </div>

            <div className="w-1/2 relative">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
                style={inputStyle("lastName")}
              />
              <p
                className={`${fadeClass} ${
                  errors.lastName
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }`}
              >
                {errors.lastName || ""}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
              style={inputStyle("email")}
            />
            <p
              className={`${fadeClass} ${
                errors.email
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {errors.email || ""}
            </p>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
              style={inputStyle("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: textColor }}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <p
              className={`${fadeClass} ${
                errors.password
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {errors.password || ""}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
              style={inputStyle("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: textColor }}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <p
              className={`${fadeClass} ${
                errors.confirmPassword
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {errors.confirmPassword || ""}
            </p>
          </div>

          {/* Mobile */}
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
              style={inputStyle("mobile")}
            />
            <p
              className={`${fadeClass} ${
                errors.mobile
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {errors.mobile || ""}
            </p>
          </div>

          {/* Gender Buttons */}
          <div className="flex justify-between gap-3">
            {["MALE", "FEMALE"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm((p) => ({ ...p, gender: g }))}
                className={`flex-1 py-3 rounded-md border font-semibold transition-all duration-300 ${
                  form.gender === g ? "shadow-md scale-105" : ""
                }`}
                style={{
                  borderColor: textColor,
                  backgroundColor:
                    form.gender === g ? textColor : "transparent",
                  color: form.gender === g ? bgColor : textColor,
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Role Dropdown */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              className="w-full p-3 rounded-md border text-left flex justify-between items-center transition-all duration-200"
              style={{
                borderColor: textColor,
                color: textColor,
                backgroundColor: "transparent",
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {form.role}
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                style={{ color: textColor }}
              />
            </button>

            <ul
              className={`absolute w-full mt-1 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top ${
                dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
              }`}
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${textColor}`,
              }}
            >
              {roles.map((r) => (
                <li
                  key={r}
                  className="p-3 cursor-pointer transition-all duration-200"
                  style={{
                    color: textColor,
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.border = `1px solid ${textColor}`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.border = "1px solid transparent")
                  }
                  onClick={() => {
                    setForm((prev) => ({ ...prev, role: r }));
                    setDropdownOpen(false);
                  }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium transition-all duration-300 flex justify-center items-center"
            style={{
              backgroundColor: textColor,
              color: bgColor,
              border: `2px solid ${textColor}`,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <Loader className="animate-spin w-5 h-5 bgColor" />: "Sign Up"}
          </button>
        </form>

        {/* Links */}
        <p className="mt-4 text-sm text-center font-semibold">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold hover:underline"
            style={{ color: textColor }}
          >
            Login
          </Link>
        </p>

        <p className="mt-2 text-sm text-center font-semibold">
          Forgot your password?{" "}
          <Link
            href="/auth/forgot-password"
            className="font-bold hover:underline"
            style={{ color: textColor }}
          >
            Reset it
          </Link>
        </p>
      </div>
    </div>
  );
}
