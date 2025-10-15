"use client";

export default function TermsPage() {
  return (
    <div className="p-6 bg-background flex justify-center">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-3xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">Terms & Conditions</h1>
        <p className="mb-2 text-text-secondary">
          Welcome to BattleZone! By accessing or using our platform, you agree to the following terms and conditions:
        </p>
        <ul className="list-disc ml-6 space-y-1 text-text-secondary">
          <li>Players must follow all tournament rules.</li>
          <li>Respect other participants and avoid misconduct.</li>
          <li>All decisions by the platform administrators are final.</li>
          <li>Any violation may result in account suspension or banning.</li>
        </ul>
      </div>
    </div>
  );
}
