// src/app/auth/layout.js
import { Nunito } from "next/font/google";
import ClientLayout from "./ClientLayout"; // Auth-specific client layout

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "BattleZone Auth",
  description: "Authentication pages for BattleZone",
};
export default function AuthLayout({ children }) {
  return (
    // Just wrap with ClientLayout or a div
    <ClientLayout>
      {/* You can optionally add an extra wrapper for styling */}
      <main>
        {children}
      </main>
    </ClientLayout>
  );
}