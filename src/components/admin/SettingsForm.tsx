"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import type { SiteSetting } from "@prisma/client";
import { Field } from "@/components/admin/FormField";
import { saveSettings } from "@/actions/settings";

export default function SettingsForm({ settings }: { settings: SiteSetting }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveSettings(formData);
      setResult(res);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {result?.ok && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4" /> {result.message}
        </div>
      )}
      {result && !result.ok && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {result.error}
        </div>
      )}

      {/* Brand */}
      <div className="card p-6">
        <h2 className="mb-4 font-bold text-steel-900">Brand</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company name" htmlFor="companyName">
            <input id="companyName" name="companyName" className="input" defaultValue={settings.companyName} />
          </Field>
          <Field label="Tagline" htmlFor="tagline">
            <input id="tagline" name="tagline" className="input" defaultValue={settings.tagline} />
          </Field>
        </div>
      </div>

      {/* Logos & media */}
      <div className="card p-6">
        <h2 className="mb-4 font-bold text-steel-900">Logos &amp; media</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Header logo URL (dark)" htmlFor="logoDark" hint="Shown on the white header.">
            <input id="logoDark" name="logoDark" className="input" defaultValue={settings.logoDark ?? ""} placeholder="https://…" />
          </Field>
          <Field label="Footer logo URL (light)" htmlFor="logoLight" hint="Shown on the dark footer.">
            <input id="logoLight" name="logoLight" className="input" defaultValue={settings.logoLight ?? ""} placeholder="https://…" />
          </Field>
          <Field label="About image URL" htmlFor="aboutImage" hint="Image beside the homepage About section.">
            <input id="aboutImage" name="aboutImage" className="input" defaultValue={settings.aboutImage ?? ""} placeholder="https://…" />
          </Field>
        </div>
        <div className="mt-5">
          <Field
            label="Hero slider images"
            htmlFor="heroImages"
            hint="One image URL per line. They rotate on the homepage hero with a slow zoom-in effect."
          >
            <textarea
              id="heroImages"
              name="heroImages"
              rows={5}
              className="input font-mono text-xs"
              defaultValue={settings.heroImages ?? ""}
              placeholder={"https://…/slide-1.jpg\nhttps://…/slide-2.jpg\nhttps://…/slide-3.jpg"}
            />
          </Field>
          {/* Preserve the single fallback image (used if the slider list is empty). */}
          <input type="hidden" name="heroImage" defaultValue={settings.heroImage ?? ""} />
        </div>
      </div>

      {/* Hero & about */}
      <div className="card p-6">
        <h2 className="mb-4 font-bold text-steel-900">Homepage</h2>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Hero headline" htmlFor="heroHeadline">
              <input id="heroHeadline" name="heroHeadline" className="input" defaultValue={settings.heroHeadline} />
            </Field>
            <Field label="Hero subtext" htmlFor="heroSubtext">
              <input id="heroSubtext" name="heroSubtext" className="input" defaultValue={settings.heroSubtext} />
            </Field>
          </div>
          <Field label="About title" htmlFor="aboutTitle">
            <input id="aboutTitle" name="aboutTitle" className="input" defaultValue={settings.aboutTitle} />
          </Field>
          <Field label="About text" htmlFor="aboutText" hint="Separate paragraphs with a blank line.">
            <textarea id="aboutText" name="aboutText" rows={6} className="input" defaultValue={settings.aboutText} />
          </Field>
        </div>
      </div>

      {/* Contact */}
      <div className="card p-6">
        <h2 className="mb-4 font-bold text-steel-900">Contact details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="email">
            <input id="email" name="email" type="email" className="input" defaultValue={settings.email} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <input id="phone" name="phone" className="input" defaultValue={settings.phone} />
          </Field>
          <Field label="Address" htmlFor="address" className="sm:col-span-2">
            <input id="address" name="address" className="input" defaultValue={settings.address} />
          </Field>
        </div>
      </div>

      {/* Links */}
      <div className="card p-6">
        <h2 className="mb-4 font-bold text-steel-900">Links & footer</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Facebook URL" htmlFor="facebook">
            <input id="facebook" name="facebook" className="input" defaultValue={settings.facebook ?? ""} />
          </Field>
          <Field label="LinkedIn URL" htmlFor="linkedin">
            <input id="linkedin" name="linkedin" className="input" defaultValue={settings.linkedin ?? ""} />
          </Field>
          <Field label="Brochure URL" htmlFor="brochureUrl" hint="Link to a downloadable PDF brochure (optional).">
            <input id="brochureUrl" name="brochureUrl" className="input" defaultValue={settings.brochureUrl ?? ""} />
          </Field>
          <Field label="Footer note" htmlFor="footerNote">
            <input id="footerNote" name="footerNote" className="input" defaultValue={settings.footerNote} />
          </Field>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-1 flex justify-end bg-steel-100/80 py-3 backdrop-blur">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
