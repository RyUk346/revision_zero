"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: string[];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await action(id, next);
          router.refresh();
        });
      }}
      className="rounded-md border border-steel-300 bg-white px-2 py-1 text-xs font-medium text-steel-700 focus:border-accent-500 focus:outline-none disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
