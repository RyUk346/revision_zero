import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import ProjectCard from "@/components/site/ProjectCard";

type Params = { params: { category: string } };

export async function generateStaticParams() {
  try {
    const cats = await prisma.projectCategory.findMany({ select: { slug: true } });
    return cats.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cat = await prisma.projectCategory.findUnique({ where: { slug: params.category } });
  if (!cat) return { title: "Projects" };
  return {
    title: `${cat.name} Projects`,
    description: cat.description ?? `${cat.name} steel detailing projects.`,
  };
}

export default async function CategoryPage({ params }: Params) {
  const category = await prisma.projectCategory.findUnique({
    where: { slug: params.category },
    include: {
      projects: { where: { published: true }, orderBy: { order: "asc" } },
    },
  });

  if (!category) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={category.name}
        subtitle={category.description ?? undefined}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: category.name }]}
      />

      <section className="section">
        <div className="container-page">
          {/* Quick links back to the full filterable list */}
          <div className="mb-8 flex justify-center">
            <Link href="/projects" className="btn-outline">
              ← All projects
            </Link>
          </div>

          {category.projects.length === 0 ? (
            <p className="text-center text-steel-500">
              Projects in this category are coming soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={{
                    title: p.title,
                    slug: p.slug,
                    image: p.image,
                    videoUrl: p.videoUrl,
                    imageColor: p.imageColor,
                    categorySlug: category.slug,
                    categoryName: category.name,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-steel-100 bg-steel-50 py-12">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold">Have a {category.name.toLowerCase()} project?</h2>
          <p className="mt-2 text-steel-600">We&apos;d love to hear about it.</p>
          <Link href="/contact" className="btn-primary mt-5">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
