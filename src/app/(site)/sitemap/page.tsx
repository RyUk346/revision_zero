import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "An overview of all pages on this website.",
};

export default async function SitemapPage() {
  const [categories, news, jobs] = await Promise.all([
    prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.newsPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    prisma.jobPosting.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h2 className="mb-3 text-lg font-bold text-steel-900">{title}</h2>
      <ul className="space-y-2 text-steel-600">{children}</ul>
    </div>
  );

  const Item = ({ href, label }: { href: string; label: string }) => (
    <li>
      <Link href={href} className="hover:text-accent-600">{label}</Link>
    </li>
  );

  return (
    <>
      <PageHeader title="Sitemap" eyebrow="Navigation" crumbs={[{ label: "Sitemap" }]} />
      <section className="section">
        <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Section title="Main">
            <Item href="/" label="Home" />
            <Item href="/who-we-are" label="Who We Are" />
            <Item href="/services" label="Services" />
            <Item href="/contact" label="Contact" />
            <Item href="/schedule-a-call" label="Schedule A Call" />
          </Section>

          <Section title="Projects">
            <Item href="/projects" label="All Projects" />
            {categories.map((c) => (
              <Item key={c.id} href={`/projects/${c.slug}`} label={c.name} />
            ))}
          </Section>

          <Section title="News">
            <Item href="/news" label="All News" />
            {news.map((n) => (
              <Item key={n.id} href={`/news/${n.slug}`} label={n.title} />
            ))}
          </Section>

          <Section title="Careers & Legal">
            <Item href="/careers" label="Careers" />
            {jobs.map((j) => (
              <Item key={j.id} href={`/careers/${j.slug}`} label={j.title} />
            ))}
            <Item href="/terms-of-use" label="Terms of Use" />
            <Item href="/privacy-policy" label="Privacy Policy" />
          </Section>
        </div>
      </section>
    </>
  );
}
