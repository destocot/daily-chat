import { TMessage } from "@/lib/store/message";
import Image from "next/image";
import MessageMenu from "./message-menu";
import { useUserStore } from "@/lib/store/user";

type MessageProps = {
  message: TMessage;
};

export default function Message({ message }: MessageProps) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message?.users?.avatar_url!}
          alt={message?.users?.display_name!}
          width={40}
          height={40}
          className="rounded-full ring-2"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
            {message.is_edit && (
              <h1 className="text-sm text-gray-400 italic">edited</h1>
            )}
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  );
}
