import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveNews } from "@/actions/news";

export default async function NewsFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const post = isNew ? null : await prisma.newsPost.findUnique({ where: { id: params.id } });
  if (!isNew && !post) notFound();

  const dateValue = (post?.publishedAt ?? new Date()).toISOString().slice(0, 10);

  return (
    <>
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to news
      </Link>
      <AdminHeader title={isNew ? "New post" : "Edit post"} />

      <form action={saveNews} className="card max-w-3xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={post!.id} />}

        <Field label="Title *" htmlFor="title">
          <input id="title" name="title" className="input" defaultValue={post?.title ?? ""} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Slug" htmlFor="slug" hint="Auto from title if blank." className="sm:col-span-1">
            <input id="slug" name="slug" className="input" defaultValue={post?.slug ?? ""} />
          </Field>
          <Field label="Author" htmlFor="author">
            <input id="author" name="author" className="input" defaultValue={post?.author ?? "Revision Zero"} />
          </Field>
          <Field label="Published date" htmlFor="publishedAt">
            <input id="publishedAt" name="publishedAt" type="date" className="input" defaultValue={dateValue} />
          </Field>
        </div>

        <Field label="Excerpt" htmlFor="excerpt" hint="Short summary used on cards and previews.">
          <textarea id="excerpt" name="excerpt" rows={2} className="input" defaultValue={post?.excerpt ?? ""} />
        </Field>

        <Field label="Content" htmlFor="content" hint="Separate paragraphs with a blank line.">
          <textarea id="content" name="content" rows={10} className="input" defaultValue={post?.content ?? ""} />
        </Field>

        <Field label="Image URL" htmlFor="image" hint="Article thumbnail / banner. Leave blank to use the placeholder colour.">
          <input id="image" name="image" className="input" defaultValue={post?.image ?? ""} placeholder="https://…" />
        </Field>

        <Field label="Placeholder colour" htmlFor="imageColor">
          <input id="imageColor" name="imageColor" type="color" className="h-11 w-32 rounded-md border border-steel-300" defaultValue={post?.imageColor ?? "#516b8c"} />
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
          Published
        </label>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create post" : "Save changes"}</SubmitButton>
          <Link href="/admin/news" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
