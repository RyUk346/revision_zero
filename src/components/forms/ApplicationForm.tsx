"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { submitApplication } from "@/actions/applications";

export default function ApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEl = e.currentTarget;
    startTransition(async () => {
      const res = await submitApplication(formData);
      setResult(res);
      if (res.ok) formEl.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      <p className="text-sm text-steel-500">
        Applying for: <span className="font-semibold text-steel-800">{jobTitle}</span>
      </p>

      {result?.ok && (
        <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}
      {result && !result.ok && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full name *</label>
          <input id="name" name="name" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="linkedin">LinkedIn / portfolio</label>
          <input id="linkedin" name="linkedin" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Cover note</label>
        <textarea id="message" name="message" rows={5} className="input" placeholder="Tell us why you'd be a great fit." />
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        <Send className="h-4 w-4" />
        {pending ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
