"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiDocumentText, HiOutlineFlag, HiShieldCheck } from "react-icons/hi";

const PlayerHeader = () => {
  const pathname = usePathname();

  const links = [
    { href: "/player/terms-and-conditions", label: "Terms", icon: HiDocumentText },
    { href: "/player/tournament-rules", label: "Rules", icon: HiOutlineFlag },
    { href: "/player/trust-safety", label: "Trust", icon: HiShieldCheck },
  ];

  return (
    <header className="p-4 flex justify-between items-center bg-header-bg text-header-text">
      <h1 className="text-xl font-bold">BattleZone Organizer</h1>
      <nav className="flex space-x-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 transition-colors duration-200 ${
                isActive
                  ? "text-accent-primary"
                  : "text-text-secondary hover:text-accent-primary"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-accent-primary" : "text-text-secondary"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default PlayerHeader;
