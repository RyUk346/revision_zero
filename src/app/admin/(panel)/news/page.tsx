import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteNews } from "@/actions/news";
import { formatDateShort } from "@/lib/utils";

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <AdminHeader
        title="News"
        description="Articles and updates published to the news section."
        action={
          <Link href="/admin/news/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New post
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {posts.length === 0 && <EmptyRow colSpan={5} label="No posts yet." />}
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3 font-medium text-steel-900">{p.title}</td>
                  <td className="px-4 py-3 text-steel-600">{p.author}</td>
                  <td className="px-4 py-3 text-steel-600">{formatDateShort(p.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-green-100 text-green-700" : "bg-steel-100 text-steel-500"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/news/${p.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100" aria-label="Edit" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteNews} id={p.id} iconOnly />
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
