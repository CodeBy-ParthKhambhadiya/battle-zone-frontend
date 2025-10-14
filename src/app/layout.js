// src/app/layout.js
import "./globals.css";
import { Nunito } from "next/font/google";
import ClientLayout from "./ClientLayout";

// Load the Nunito font (server-safe)
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "BattleZone",
  description: "Your game platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.className} bg-[var(--background)] text-[var(--text-primary)]`}
    >
      <body>
        {/* ClientLayout should NOT have html/body tags */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
