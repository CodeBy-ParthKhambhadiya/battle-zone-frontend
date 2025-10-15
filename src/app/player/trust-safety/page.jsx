"use client";

export default function TrustSafetyPage() {
  return (
    <div className="p-6 bg-background flex justify-center">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-3xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">Trust & Safety</h1>
        <p className="mb-2 text-text-secondary">
          Your safety is our top priority. Here's how we maintain a secure and trustworthy environment:
        </p>
        <ul className="list-disc ml-6 space-y-1 text-text-secondary">
          <li>All personal information is protected and never shared without consent.</li>
          <li>Suspicious activity is monitored and investigated immediately.</li>
          <li>Players can report issues directly to our support team.</li>
          <li>We enforce strict anti-cheating measures and fair gameplay policies.</li>
        </ul>
      </div>
    </div>
  );
}
