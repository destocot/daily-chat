"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TMessage, useMessageStore } from "@/lib/store/message";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";

export function EditAlert() {
  const actionMessage = useMessageStore((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessageStore(
    (state) => state.optimisticUpdateMessage
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = async () => {
    const text = inputRef.current?.value.trim();
    if (text) {
      optimisticUpdateMessage({
        ...(actionMessage as TMessage),
        text,
        is_edit: true,
      });

      const supabase = createClient();

      const { error } = await supabase
        .from("messages")
        .update({ text, is_edit: true })
        .eq("id", actionMessage?.id!);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully updated message");
      }

      document.getElementById("trigger-edit")?.click();
    } else {
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-delete")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Input defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" className="w-full" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAlert() {
  const actionMessage = useMessageStore((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessageStore(
    (state) => state.optimisticDeleteMessage
  );

  const handleDeleteMessage = async () => {
    optimisticDeleteMessage(actionMessage?.id!);

    const supabase = createClient();

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully deleted message");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
