// src/app/page.js
export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <section className="my-8">
        <h1 className="text-3xl font-bold mb-4 text-[#1E3A8A]">
          Welcome to BattleZone!
        </h1>
        <h2 className="text-xl font-semibold mb-2 text-[#047857]">
          Upcoming Tournaments
        </h2>
        <p className="text-[#111827]">
          Join upcoming tournaments and challenge the best players.
        </p>
        <p className="text-[#6B7280] text-sm">
          Sign up now and get early access to tournaments.
        </p>
      </section>

      {/* Add tournament cards, quick links, etc. */}
    </div>
  );
}
