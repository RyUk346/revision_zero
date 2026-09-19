import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import ProjectsExplorer from "@/components/site/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore our steel detailing projects across bridges, mining and resources, commercial and light industrial, health and education, and animation.",
};

export default async function ProjectsPage() {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      projects: { where: { published: true }, orderBy: { order: "asc" } },
    },
  });

  const explorerCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const projects = categories.flatMap((c) =>
    c.projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.image,
      videoUrl: p.videoUrl,
      imageColor: p.imageColor,
      categorySlug: c.slug,
      categoryName: c.name,
    }))
  );

  return (
    <>
      <PageHeader
        eyebrow="Our Work"
        title="Projects"
        subtitle="A selection of work across every sector we detail. Filter by category below."
        crumbs={[{ label: "Projects" }]}
      />

      <section className="section">
        <div className="container-page">
          <ProjectsExplorer categories={explorerCategories} projects={projects} />
        </div>
      </section>
    </>
  );
}
