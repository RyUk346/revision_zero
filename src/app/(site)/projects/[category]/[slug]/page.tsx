import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building, MapPin, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import RemoteImage from "@/components/ui/RemoteImage";
import ProjectCard from "@/components/site/ProjectCard";

type Params = { params: { category: string; slug: string } };

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, category: { select: { slug: true } } },
    });
    return projects.map((p) => ({ category: p.category.slug, slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary ?? project.description ?? `${project.title} — ${project.category.name}.`,
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  // Guard: must exist, be published, and live under the right category URL.
  if (!project || !project.published || project.category.slug !== params.category) {
    notFound();
  }

  const related = await prisma.project.findMany({
    where: {
      categoryId: project.categoryId,
      published: true,
      NOT: { id: project.id },
    },
    orderBy: { order: "asc" },
    take: 4,
  });

  const hasMeta = project.client || project.location || project.year;

  return (
    <>
      <PageHeader
        eyebrow={project.category.name}
        title={project.title}
        color={project.imageColor}
        crumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.category.name, href: `/projects/${project.category.slug}` },
          { label: project.title },
        ]}
      />

      <article className="section">
        <div className="container-page max-w-4xl">
          {/* Main media */}
          {project.videoUrl ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={project.image ?? undefined}
              className="aspect-video w-full rounded-2xl bg-steel-900 shadow-sm"
            >
              <source src={project.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <RemoteImage
              src={project.image}
              alt={project.title}
              color={project.imageColor}
              label={project.category.name}
              ratio="aspect-[16/9]"
              rounded="rounded-2xl"
            />
          )}

          {/* Meta */}
          {hasMeta && (
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-steel-100 py-4 text-sm">
              {project.client && (
                <span className="inline-flex items-center gap-2 text-steel-600">
                  <Building className="h-4 w-4 text-accent-500" />
                  <span className="font-semibold text-steel-800">Client:</span> {project.client}
                </span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-2 text-steel-600">
                  <MapPin className="h-4 w-4 text-accent-500" />
                  <span className="font-semibold text-steel-800">Location:</span> {project.location}
                </span>
              )}
              {project.year && (
                <span className="inline-flex items-center gap-2 text-steel-600">
                  <CalendarDays className="h-4 w-4 text-accent-500" />
                  <span className="font-semibold text-steel-800">Year:</span> {project.year}
                </span>
              )}
            </div>
          )}

          {/* Body */}
          <div className="prose-page mt-8">
            {(project.description || project.summary || "")
              .split("\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>

          <div className="mt-10 border-t border-steel-100 pt-6">
            <Link
              href={`/projects/${project.category.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {project.category.name}
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-steel-100 bg-steel-50 py-14">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold">More in {project.category.name}</h2>
              <Link href={`/projects/${project.category.slug}`} className="btn-outline">
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={{
                    title: p.title,
                    slug: p.slug,
                    image: p.image,
                    videoUrl: p.videoUrl,
                    imageColor: p.imageColor,
                    categorySlug: project.category.slug,
                    categoryName: project.category.name,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
