// /src/app/player/home/page.jsx
"use client";

export default function PlayerHomePage() {
  const cards = [
    { title: "Manage Games", description: "Add, edit, or remove your games.", color: "bg-blue-100 text-blue-800" },
    { title: "View Stats", description: "Check your performance stats and rankings.", color: "bg-green-100 text-green-800" },
    { title: "Achievements", description: "Track your achievements and badges.", color: "bg-yellow-100 text-yellow-800" },
    { title: "Profile Settings", description: "Update your profile and preferences.", color: "bg-purple-100 text-purple-800" },
    { title: "Messages", description: "Check messages and notifications.", color: "bg-pink-100 text-pink-800" },
    { title: "Leaderboard", description: "See how you rank against other players.", color: "bg-indigo-100 text-indigo-800" }, { title: "Manage Games", description: "Add, edit, or remove your games.", color: "bg-blue-100 text-blue-800" },
    { title: "View Stats", description: "Check your performance stats and rankings.", color: "bg-green-100 text-green-800" },
    { title: "Achievements", description: "Track your achievements and badges.", color: "bg-yellow-100 text-yellow-800" },
    { title: "Profile Settings", description: "Update your profile and preferences.", color: "bg-purple-100 text-purple-800" },
    { title: "Messages", description: "Check messages and notifications.", color: "bg-pink-100 text-pink-800" },
    // { title: "Leaderboard", description: "See how you rank against other players.", color: "bg-indigo-100 text-indigo-800" }, { title: "Manage Games", description: "Add, edit, or remove your games.", color: "bg-blue-100 text-blue-800" },
    // { title: "View Stats", description: "Check your performance stats and rankings.", color: "bg-green-100 text-green-800" },
    // { title: "Achievements", description: "Track your achievements and badges.", color: "bg-yellow-100 text-yellow-800" },
    // { title: "Profile Settings", description: "Update your profile and preferences.", color: "bg-purple-100 text-purple-800" },
    // { title: "Messages", description: "Check messages and notifications.", color: "bg-pink-100 text-pink-800" },
    // { title: "Leaderboard", description: "See how you rank against other players.", color: "bg-indigo-100 text-indigo-800" }, { title: "Manage Games", description: "Add, edit, or remove your games.", color: "bg-blue-100 text-blue-800" },
    // { title: "View Stats", description: "Check your performance stats and rankings.", color: "bg-green-100 text-green-800" },
    // { title: "Achievements", description: "Track your achievements and badges.", color: "bg-yellow-100 text-yellow-800" },
    // { title: "Profile Settings", description: "Update your profile and preferences.", color: "bg-purple-100 text-purple-800" },
    // { title: "Messages", description: "Check messages and notifications.", color: "bg-pink-100 text-pink-800" },
    // { title: "Leaderboard", description: "See how you rank against other players.", color: "bg-indigo-100 text-indigo-800" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Welcome to Player Home!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 ${card.color}`}
          >
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
