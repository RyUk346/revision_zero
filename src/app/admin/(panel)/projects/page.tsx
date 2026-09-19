import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProject } from "@/actions/projects";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });

  return (
    <>
      <AdminHeader
        title="Projects"
        description="Manage portfolio projects shown across the site."
        action={
          <Link href="/admin/projects/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New project
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {projects.length === 0 && <EmptyRow colSpan={5} label="No projects yet." />}
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-steel-900">
                      <span
                        className="h-6 w-6 shrink-0 rounded"
                        style={{ backgroundColor: p.imageColor }}
                      />
                      {p.title}
                      {p.featured && <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-steel-600">{p.category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.published ? "bg-green-100 text-green-700" : "bg-steel-100 text-steel-500"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel-600">{p.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteProject} id={p.id} iconOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
