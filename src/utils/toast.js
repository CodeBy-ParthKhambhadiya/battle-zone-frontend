import { toast } from "react-hot-toast";

const defaultOptions = {
  position: "top-right",
  duration: 4000,
};

const Toast = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message, options = {}) => {
    toast(message, { ...defaultOptions, ...options });
  },
};

export default Toast;
