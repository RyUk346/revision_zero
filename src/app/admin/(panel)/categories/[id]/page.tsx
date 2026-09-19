import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveCategory } from "@/actions/categories";

export default async function CategoryFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const category = isNew ? null : await prisma.projectCategory.findUnique({ where: { id: params.id } });
  if (!isNew && !category) notFound();

  return (
    <>
      <Link href="/admin/categories" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to categories
      </Link>
      <AdminHeader title={isNew ? "New category" : "Edit category"} />

      <form action={saveCategory} className="card max-w-2xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={category!.id} />}

        <Field label="Name *" htmlFor="name">
          <input id="name" name="name" className="input" defaultValue={category?.name ?? ""} required />
        </Field>

        <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate.">
          <input id="slug" name="slug" className="input" defaultValue={category?.slug ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea id="description" name="description" rows={3} className="input" defaultValue={category?.description ?? ""} />
        </Field>

        <Field label="Image URL" htmlFor="image" hint="Shown on the home and projects pages.">
          <input id="image" name="image" className="input" defaultValue={category?.image ?? ""} placeholder="https://…" />
        </Field>

        <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
          <input id="order" name="order" type="number" className="input w-32" defaultValue={category?.order ?? 0} />
        </Field>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create category" : "Save changes"}</SubmitButton>
          <Link href="/admin/categories" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
