import ChatAbout from "@/components/chat-about";
import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import InitUser from "@/lib/store/initUser";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col relative">
          <ChatHeader user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
