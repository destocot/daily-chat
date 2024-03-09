"use client";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useUserStore } from "./user";

type InitUserProps = {
  user: User | undefined;
};

export default function InitUser({ user }: InitUserProps) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUserStore.setState({ user });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
