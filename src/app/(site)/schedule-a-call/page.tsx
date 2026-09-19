import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import CallForm from "@/components/forms/CallForm";

export const metadata: Metadata = {
  title: "Schedule A Call",
  description: "Book a call with our steel detailing team to discuss your project.",
};

const POINTS = [
  "A no-obligation chat about your project",
  "Advice on the right detailing approach",
  "Indicative timelines and next steps",
  "Answers to any questions about how we work",
];

export default function ScheduleCallPage() {
  return (
    <>
      <PageHeader
        eyebrow="Let's Talk"
        title="Schedule a call"
        subtitle="Pick a time that suits you and we'll call to discuss your project."
        crumbs={[{ label: "Schedule A Call" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">What to expect</h2>
            <ul className="mt-6 space-y-4">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-steel-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl bg-steel-50 p-6">
              <p className="text-sm leading-relaxed text-steel-600">
                Prefer to write instead? You can reach us any time through the{" "}
                <a href="/contact" className="font-semibold text-accent-600 hover:text-accent-700">contact page</a>.
              </p>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold">Request a call</h2>
            <p className="mt-1 text-sm text-steel-500">We&apos;ll confirm a time by email.</p>
            <div className="mt-6">
              <CallForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
