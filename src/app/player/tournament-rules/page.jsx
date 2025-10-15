"use client";

export default function RulesPage() {
  return (
    <div className="p-6 bg-background flex justify-center">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-3xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">Tournament Rules</h1>
        <p className="mb-2 text-text-secondary">
          To ensure fair play and an enjoyable experience, all players must adhere to the following rules:
        </p>
        <ul className="list-disc ml-6 space-y-1 text-text-secondary">
          <li>Each match must be played according to the official schedule.</li>
          <li>No cheating, hacking, or exploiting bugs.</li>
          <li>Sportsmanship is mandatory; harassment will not be tolerated.</li>
          <li>Match results are final once confirmed by referees.</li>
        </ul>
      </div>
    </div>
  );
}
