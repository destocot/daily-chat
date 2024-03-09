"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { getFromAndTop } from "@/lib/utils";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { useMessageStore } from "@/lib/store/message";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessageStore((state) => state.page);
  const setMessages = useMessageStore((state) => state.setMessages);
  const hasMore = useMessageStore((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTop(page, LIMIT_MESSAGE);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*, users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button variant="outline" className="w-full" onClick={fetchMore}>
        Load More
      </Button>
    );
  }

  return <></>;
}
