import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and insights from our steel detailing team.",
};

const PER_PAGE = 4;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const total = await prisma.newsPost.count({ where: { published: true } });
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const requested = parseInt(searchParams.page ?? "1", 10);
  const page = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), totalPages);

  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  const pageHref = (n: number) => (n <= 1 ? "/news" : `/news?page=${n}`);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="News"
        subtitle="Updates, insights and stories from the team."
        crumbs={[{ label: "News" }]}
      />

      <section className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-center text-steel-500">No articles published yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <article key={p.id} className="card group flex flex-col overflow-hidden hover:shadow-md">
                  <Link href={`/news/${p.slug}`} className="block">
                    <RemoteImage
                      src={p.image}
                      alt={p.title}
                      color={p.imageColor}
                      ratio="aspect-[16/10]"
                      rounded="rounded-none"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                      {formatDate(p.publishedAt)}
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-snug">
                      <Link href={`/news/${p.slug}`} className="hover:text-accent-700">
                        {p.title}
                      </Link>
                    </h2>
                    {p.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-steel-600">{p.excerpt}</p>
                    )}
                    <Link
                      href={`/news/${p.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="inline-flex items-center gap-1 rounded-md border border-steel-200 px-3 py-2 text-sm font-semibold text-steel-700 hover:border-accent-400 hover:text-accent-700">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-steel-100 px-3 py-2 text-sm font-semibold text-steel-300">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-semibold ${
                    n === page
                      ? "bg-accent-600 text-white"
                      : "border border-steel-200 text-steel-700 hover:border-accent-400 hover:text-accent-700"
                  }`}
                >
                  {n}
                </Link>
              ))}

              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="inline-flex items-center gap-1 rounded-md border border-steel-200 px-3 py-2 text-sm font-semibold text-steel-700 hover:border-accent-400 hover:text-accent-700">
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-steel-100 px-3 py-2 text-sm font-semibold text-steel-300">
                  Next <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
