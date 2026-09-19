import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Building2, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import ApplicationForm from "@/components/forms/ApplicationForm";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return jobs.map((j) => ({ slug: j.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const job = await prisma.jobPosting.findUnique({ where: { slug: params.slug } });
  if (!job) return { title: "Careers" };
  return { title: job.title, description: job.summary ?? undefined };
}

export default async function JobPage({ params }: Params) {
  const job = await prisma.jobPosting.findUnique({ where: { slug: params.slug } });
  if (!job || !job.published) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title={job.title}
        crumbs={[{ label: "Careers", href: "/careers" }, { label: job.title }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-steel-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent-500" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-accent-500" /> {job.type}
              </span>
              {job.department && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-accent-500" /> {job.department}
                </span>
              )}
            </div>

            {job.description && (
              <div className="mt-6">
                <h2 className="text-xl font-bold">About the role</h2>
                <div className="prose-page mt-3">
                  {job.description.split("\n").filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {job.requirements && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">What we&apos;re looking for</h2>
                <ul className="prose-page mt-3 list-disc space-y-2 pl-5">
                  {job.requirements
                    .split(/[;\n]/)
                    .map((r) => r.trim())
                    .filter(Boolean)
                    .map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <Link href="/careers" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
                <ArrowLeft className="h-4 w-4" /> Back to all roles
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-28 p-6">
              <h2 className="text-lg font-bold">Apply now</h2>
              <p className="mt-1 text-sm text-steel-500">
                Submit your details and we&apos;ll be in touch.
              </p>
              <div className="mt-5">
                <ApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
