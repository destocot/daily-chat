"use client";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuid } from "uuid";
import { useUserStore } from "@/lib/store/user";
import { TMessage, useMessageStore } from "@/lib/store/message";

export default function ChatInput() {
  const user = useUserStore((state) => state.user);
  const addMessage = useMessageStore((state) => state.addMessage);
  const setOptimisticIds = useMessageStore((state) => state.setOptimisticIds);

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const text = (e.target as HTMLInputElement).value;
      if (!text.trim()) {
        return toast.error("Message cannot be empty");
      }

      const id = uuid();
      const newMessage = {
        id,
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          display_name: user?.user_metadata.user_name,
          created_at: new Date().toISOString(),
        },
      };

      addMessage(newMessage as TMessage);
      setOptimisticIds(newMessage.id);

      const supabase = createClient();
      const { error } = await supabase.from("messages").insert({ id, text });

      if (error) {
        return toast.error(error.message);
      }

      (e.target as HTMLInputElement).value = "";
    }
  };

  return (
    <div className="p-5">
      <Input placeholder="send message" onKeyDown={handleSendMessage} />
    </div>
  );
}
