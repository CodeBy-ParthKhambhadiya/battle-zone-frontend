import { toast } from "react-hot-toast";

const bgColor = "#0D1117";   // dark card background
const textColor = "#00E5FF"; // glowing cyan text

// Responsive adjustments using window width
const getResponsiveStyle = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640; // sm breakpoint
  return {
    padding: isMobile ? "10px 12px" : "12px 16px",
    fontSize: isMobile ? "12px" : "14px",
    borderRadius: isMobile ? "8px" : "10px",
    lineHeight: isMobile ? "1.3" : "1.5",
  };
};

const defaultOptions = {
  position: "top-right",
  duration: 4000,
  style: {
    ...getResponsiveStyle(),
    fontWeight: 500,
    color: textColor,
    background: bgColor,
    border: `1px solid ${textColor}`,
    boxShadow: `0 0 10px ${textColor}`,
    textShadow: `0 0 6px ${textColor}`,
    maxWidth: "90vw", // prevents overflow on small screens
    wordBreak: "break-word",
  },
};

const Toast = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...defaultOptions,
      iconTheme: {
        primary: textColor,
        secondary: bgColor,
      },
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        ...getResponsiveStyle(),
        color: "#FF4C4C",
        border: "1px solid #FF4C4C",
        boxShadow: "0 0 10px #FF4C4C",
        textShadow: "0 0 6px #FF4C4C",
      },
      iconTheme: {
        primary: "#FF4C4C",
        secondary: bgColor,
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      ...defaultOptions,
      iconTheme: {
        primary: textColor,
        secondary: bgColor,
      },
      ...options,
    });
  },
};

export default Toast;
