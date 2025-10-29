// src/app/layout.js
import "./globals.css";
import { Nunito } from "next/font/google";
import ClientLayout from "./ClientLayout";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "BattleZone",
  description: "Your game platform",
};

export default function RootLayout({ children }) {
  return (
  <html lang="en" className={nunito.className}>
  <body>
    <ClientLayout>{children}</ClientLayout>
  </body>
</html>
  );
}
