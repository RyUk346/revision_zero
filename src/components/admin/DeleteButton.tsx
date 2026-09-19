"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Are you sure you want to delete this? This cannot be undone.",
  iconOnly = false,
}: {
  action: (id: string) => Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
  iconOnly?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  }

  if (iconOnly) {
    return (
      <button
        onClick={onClick}
        disabled={pending}
        aria-label={label}
        title={label}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {label}
    </button>
  );
}
