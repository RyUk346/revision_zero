"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Loader2 } from "lucide-react";
import { toggleMessageRead } from "@/actions/contact";

export default function ReadToggle({ id, read }: { id: string; read: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await toggleMessageRead(id, !read);
          router.refresh();
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-steel-200 px-2.5 py-1.5 text-xs font-semibold text-steel-600 hover:bg-steel-50 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : read ? (
        <MailOpen className="h-3.5 w-3.5" />
      ) : (
        <Mail className="h-3.5 w-3.5" />
      )}
      {read ? "Mark unread" : "Mark read"}
    </button>
  );
}
