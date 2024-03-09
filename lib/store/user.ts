import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | undefined;
}

export const useUserStore = create<UserState>()((set) => ({
  user: undefined,
}));
