"use client";

const PlayerFooter = () => {
  return (
    <footer
      className="p-4 text-center mt-auto"
      style={{ backgroundColor: "var(--header-bg)", color: "var(--header-text)" }}
    >
      <p>&copy; {new Date().getFullYear()} BattleZone. All rights reserved.</p>
    </footer>
  );
};

export default PlayerFooter;