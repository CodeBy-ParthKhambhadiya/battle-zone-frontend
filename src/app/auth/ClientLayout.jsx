"use client";

import Header from "@/components/Header";
import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  );
}
