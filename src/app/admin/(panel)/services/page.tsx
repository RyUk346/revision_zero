import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import Icon from "@/components/ui/Icon";
import { deleteService } from "@/actions/services";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <AdminHeader
        title="Services"
        description="The services listed on your site."
        action={
          <Link href="/admin/services/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New service
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Summary</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {services.length === 0 && <EmptyRow colSpan={5} label="No services yet." />}
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-steel-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-50 text-accent-600">
                        <Icon name={s.icon} className="h-4 w-4" />
                      </span>
                      {s.title}
                    </div>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-steel-600">{s.summary}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.published ? "bg-green-100 text-green-700" : "bg-steel-100 text-steel-500"}`}>
                      {s.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel-600">{s.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/services/${s.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100" aria-label="Edit" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteService} id={s.id} iconOnly />
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
