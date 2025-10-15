// src/app/ClientLayout.jsx
"use client";

import Header from "@/components/Header";
import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/middleware"; // ✅ correct default import

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <AuthGuard /> {/* runs the redirect logic */}
     
      <main>{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  );
}
