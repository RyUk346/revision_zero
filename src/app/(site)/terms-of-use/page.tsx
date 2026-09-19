import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing use of this website.",
};

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Terms of Use" eyebrow="Legal" crumbs={[{ label: "Terms of Use" }]} />
      <section className="section">
        <div className="container-page max-w-3xl space-y-6 text-steel-600">
          <p className="text-sm text-steel-400">
            This is a placeholder terms-of-use template for a demo build. Replace it with your own
            legally reviewed content before going live.
          </p>

          <div>
            <h2 className="text-xl font-bold text-steel-900">1. Acceptance of terms</h2>
            <p className="mt-2">
              By accessing and using this website you accept and agree to be bound by these terms.
              If you do not agree, please do not use the site.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">2. Use of the site</h2>
            <p className="mt-2">
              You may use this site for lawful purposes only. You agree not to use it in any way
              that could damage, disable or impair the site or interfere with anyone else&apos;s use
              of it.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">3. Intellectual property</h2>
            <p className="mt-2">
              All content on this site, including text, graphics and logos, is owned by or licensed
              to {s.companyName} and is protected by applicable intellectual-property laws.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">4. Limitation of liability</h2>
            <p className="mt-2">
              This site is provided on an &quot;as is&quot; basis. To the fullest extent permitted by
              law, {s.companyName} excludes all warranties and is not liable for any loss arising
              from use of the site.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">5. Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${s.email}`} className="font-semibold text-accent-600">{s.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
