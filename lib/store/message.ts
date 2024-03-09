import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type TMessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string | null;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: TMessage[];
  actionMessage: TMessage | undefined;
  optimisticIds: string[];
  addMessage: (message: TMessage) => void;
  setActionMessage: (message: TMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: TMessage) => void;
  setOptimisticIds: (id: string) => void;
  setMessages: (messages: TMessage[]) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  setOptimisticIds: (id) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),
  optimisticUpdateMessage: (updatedMessage) =>
    set((state) => {
      return {
        messages: state.messages.map((message) => {
          if (message.id === updatedMessage.id) {
            message.text = updatedMessage.text;
            message.is_edit = updatedMessage.is_edit;
            return message;
          }
          return message;
        }),
      };
    }),
  setMessages: (messages) => {
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    }));
  },
}));
