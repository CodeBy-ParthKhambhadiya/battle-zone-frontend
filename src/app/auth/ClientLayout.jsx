"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "@/store";
import Header from "@/components/Header";
import { getRandomColor } from "@/components/getColor";
import { ThemeContext } from "@/context/ThemeContext";

export default function ClientLayout({ children }) {
  // const [colors, setColors] = useState(null); // start as null, not default colors

const [colors, setColors] = useState({
  bgColor: "#0D1117",   // dark card background
  textColor: "#00E5FF", // glowing cyan text
}); 
 // useEffect(() => {
  //   // Generate and set colors before rendering
  //   const generatedColors = getRandomColor();
  //   setColors(generatedColors);
  // }, []);

  // 💡 Prevent rendering until colors are ready
  if (!colors) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={colors}>
        <div className="min-h-screen bg-black transition-all duration-500">
          <Header colors={colors} />
          <main className="transition-all duration-500">{children}</main>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </ThemeContext.Provider>
    </Provider>
  );
}
