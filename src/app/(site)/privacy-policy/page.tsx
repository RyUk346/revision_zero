import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use and protect your personal information.",
};

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Privacy Policy" eyebrow="Legal" crumbs={[{ label: "Privacy Policy" }]} />
      <section className="section">
        <div className="container-page max-w-3xl space-y-6 text-steel-600">
          <p className="text-sm text-steel-400">
            This is a placeholder privacy-policy template for a demo build. Replace it with your own
            legally reviewed content before going live.
          </p>

          <div>
            <h2 className="text-xl font-bold text-steel-900">Information we collect</h2>
            <p className="mt-2">
              When you contact us or submit a form, we collect the information you provide such as
              your name, email address, phone number and message. We may also collect basic,
              anonymous usage data to improve the site.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">How we use your information</h2>
            <p className="mt-2">
              We use your information to respond to enquiries, provide our services, and improve our
              website. We do not sell your personal information to third parties.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">Data retention</h2>
            <p className="mt-2">
              We retain submissions for as long as necessary to handle your enquiry and for our
              legitimate business records, after which they are securely deleted.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">Your rights</h2>
            <p className="mt-2">
              You may request access to, correction of, or deletion of your personal information at
              any time by contacting us.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-steel-900">Contact</h2>
            <p className="mt-2">
              For privacy questions, contact{" "}
              <a href={`mailto:${s.email}`} className="font-semibold text-accent-600">{s.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
