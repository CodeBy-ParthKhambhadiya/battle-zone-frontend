"use client";

import ChatArea from "@/components/ChatArea";
import { usePathname } from "next/navigation";

export default function ChatRoomPage() {
  const pathname = usePathname();

  // Assuming your route is like /chat/[roomId]
  const roomId = pathname.split("/").pop();

  return (
    <div className="flex flex-col bg-gray-900 text-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Chat Room: {roomId}
      </h2>

      {/* Make ChatArea flex-1 so it fills remaining height */}
      <div className="flex-1 min-h-0">
        <ChatArea roomId={roomId} />
      </div>
    </div>
  );
}
