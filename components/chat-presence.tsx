"use client";
import { useUserStore } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ChatPresence() {
  const user = useUserStore((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("chat-room");
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Synced presence state: ", channel.presenceState());
        const userIds = [];

        for (const id in channel.presenceState()) {
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }

        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (!user) {
    return <div className="h-3 w-1"></div>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
      <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
    </div>
  );
}
