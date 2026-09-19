import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCategory } from "@/actions/categories";

export default async function AdminCategoriesPage() {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Project categories"
        description="Sectors used to group your projects."
        action={
          <Link href="/admin/categories/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New category
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Projects</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {categories.length === 0 && <EmptyRow colSpan={5} label="No categories yet." />}
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3 font-medium text-steel-900">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-steel-500">{c.slug}</td>
                  <td className="px-4 py-3 text-steel-600">{c._count.projects}</td>
                  <td className="px-4 py-3 text-steel-600">{c.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton
                        action={deleteCategory}
                        id={c.id}
                        iconOnly
                        confirmText="Delete this category? All projects in it will also be deleted."
                      />
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
