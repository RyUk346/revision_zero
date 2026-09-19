import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveProject } from "@/actions/projects";

export default async function ProjectFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const [project, categories] = await Promise.all([
    isNew ? null : prisma.project.findUnique({ where: { id: params.id } }),
    prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!isNew && !project) notFound();

  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <AdminHeader title={isNew ? "New project" : "Edit project"} />

      <form action={saveProject} className="card max-w-3xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={project!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title *" htmlFor="title" className="sm:col-span-2">
            <input id="title" name="title" className="input" defaultValue={project?.title ?? ""} required />
          </Field>

          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the title.">
            <input id="slug" name="slug" className="input" defaultValue={project?.slug ?? ""} />
          </Field>

          <Field label="Category *" htmlFor="categoryId">
            <select id="categoryId" name="categoryId" className="input" defaultValue={project?.categoryId ?? ""} required>
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Client" htmlFor="client">
            <input id="client" name="client" className="input" defaultValue={project?.client ?? ""} />
          </Field>

          <Field label="Location" htmlFor="location">
            <input id="location" name="location" className="input" defaultValue={project?.location ?? ""} />
          </Field>

          <Field label="Year" htmlFor="year">
            <input id="year" name="year" className="input" defaultValue={project?.year ?? ""} />
          </Field>

          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" name="order" type="number" className="input" defaultValue={project?.order ?? 0} />
          </Field>
        </div>

        <Field label="Summary" htmlFor="summary" hint="Short text used on cards.">
          <textarea id="summary" name="summary" rows={2} className="input" defaultValue={project?.summary ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description" hint="Full text shown on the category page.">
          <textarea id="description" name="description" rows={5} className="input" defaultValue={project?.description ?? ""} />
        </Field>

        <Field label="Image URL" htmlFor="image" hint="Main project image. Leave blank to use the placeholder colour.">
          <input id="image" name="image" className="input" defaultValue={project?.image ?? ""} placeholder="https://…" />
        </Field>

        <Field label="Video URL (MP4)" htmlFor="videoUrl" hint="Optional — for animation projects. Plays on the category page.">
          <input id="videoUrl" name="videoUrl" className="input" defaultValue={project?.videoUrl ?? ""} placeholder="https://….mp4" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Placeholder colour" htmlFor="imageColor" hint="Used when no image is set.">
            <input id="imageColor" name="imageColor" type="color" className="h-11 w-full rounded-md border border-steel-300" defaultValue={project?.imageColor ?? "#34465e"} />
          </Field>

          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
              <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 rounded border-steel-300" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
              <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
              Published
            </label>
          </div>
        </div>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create project" : "Save changes"}</SubmitButton>
          <Link href="/admin/projects" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
