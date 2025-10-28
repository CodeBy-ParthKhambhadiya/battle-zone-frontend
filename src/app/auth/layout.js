import { Nunito } from "next/font/google";
import ClientLayout from "./ClientLayout";

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
    <ClientLayout>
      <main className={`${nunito.variable} font-sans`}>{children}</main>
    </ClientLayout>
  );
}
