import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/site/PageHeader";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatDate } from "@/lib/utils";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await prisma.newsPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "News" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function NewsArticlePage({ params }: Params) {
  const post = await prisma.newsPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.published) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`${formatDate(post.publishedAt)} · ${post.author}`}
        title={post.title}
        color={post.imageColor}
        crumbs={[{ label: "News", href: "/news" }, { label: post.title }]}
      />

      <article className="section">
        <div className="container-page max-w-3xl">
          {post.image && (
            <RemoteImage
              src={post.image}
              alt={post.title}
              ratio="aspect-[16/9]"
              rounded="rounded-2xl"
              className="mb-8"
            />
          )}

          {post.excerpt && (
            <p className="mb-6 text-lg font-medium text-steel-500">{post.excerpt}</p>
          )}
          <div className="prose-page">
            {(post.content ?? "")
              .split("\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>

          <div className="mt-10 border-t border-steel-100 pt-6">
            <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
              <ArrowLeft className="h-4 w-4" /> Back to all news
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
