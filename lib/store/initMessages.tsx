"use client";
import { useEffect, useRef } from "react";
import { TMessage, useMessageStore } from "./message";
import { LIMIT_MESSAGE } from "../constant";

type InitMessagesProps = {
  messages: TMessage[];
};

export default function InitMessages({ messages }: InitMessagesProps) {
  const initState = useRef(false);

  const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useMessageStore.setState({ messages, hasMore });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
