"use client";

import { TMessage, useMessageStore } from "@/lib/store/message";
import Message from "./message";
import { DeleteAlert, EditAlert } from "./message-actions";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./load-more-messages";

export default function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessageStore((state) => state);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };

              addMessage(newMessage as TMessage);
            }
          }
          const scrollContainer = scrollRef.current;
          if (!scrollContainer) return;

          const isScroll =
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

          if (isScroll) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdateMessage(payload.new as TMessage);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  ]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, userScrolled]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const isScroll =
      scrollContainer.scrollTop <
      scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

    setUserScrolled(isScroll);

    if (
      scrollContainer.scrollTop <
      scrollContainer.scrollHeight - scrollContainer.clientHeight
    ) {
      setNotification(0);
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      setNotification(0);
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  };

  return (
    <>
      <div
        className="flex-1 flex-col flex p-5 h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1 pb-5">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}
        </div>
        <EditAlert />
        <DeleteAlert />
      </div>
      {userScrolled && (
        <div className="absolute bottom-20 right-1/2">
          {notification ? (
            <div
              className="w-36 bg-indigo-500 p-1 rounded-md cursor-pointer hover:scale-110 transition-all text-center"
              onClick={scrollDown}
            >
              <h1>New {notification} messages</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}
