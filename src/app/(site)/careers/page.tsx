import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our steel detailing team. We invest in training and career development, from trainee detailers to certified professionals.",
};

export default async function CareersPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Join Us"
        title="Careers"
        subtitle="Grow your career with a team that invests in training, mentoring and certification."
        crumbs={[{ label: "Careers" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold">Why work with us</h2>
            <ul className="prose-page mt-4 space-y-3">
              <li>A clear path from trainee to certified detailer.</li>
              <li>In-house training and mentoring programmes.</li>
              <li>Work on landmark projects across multiple sectors.</li>
              <li>A culture that values balance and continuous improvement.</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold">Open positions</h2>
            {jobs.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-steel-600">
                  There are no open positions right now — but we&apos;re always keen to hear from
                  talented people.
                </p>
                <Link href="/contact" className="btn-primary mt-4">Send us your CV</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((j) => (
                  <Link
                    key={j.id}
                    href={`/careers/${j.slug}`}
                    className="card group flex items-center justify-between gap-4 p-6 hover:shadow-md"
                  >
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-accent-700">{j.title}</h3>
                      {j.summary && <p className="mt-1 text-sm text-steel-600">{j.summary}</p>}
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium text-steel-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-accent-500" /> {j.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-accent-500" /> {j.type}
                        </span>
                        {j.department && <span>{j.department}</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-accent-500 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
