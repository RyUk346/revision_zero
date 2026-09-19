import { Mail, Phone, Building, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import ReadToggle from "@/components/admin/ReadToggle";
import { deleteMessage } from "@/actions/contact";
import { formatDate } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${messages.length} total · ${unread} unread — contact form submissions.`}
      />

      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="card p-10 text-center text-steel-400">No messages yet.</div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`card p-5 ${!m.read ? "ring-1 ring-accent-200" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-steel-900">{m.name}</h2>
                  {!m.read && (
                    <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-700">
                      New
                    </span>
                  )}
                </div>
                {m.subject && <p className="text-sm font-medium text-steel-700">{m.subject}</p>}
              </div>
              <div className="flex items-center gap-2">
                <ReadToggle id={m.id} read={m.read} />
                <DeleteButton action={deleteMessage} id={m.id} iconOnly />
              </div>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm text-steel-600">{m.message}</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-steel-100 pt-3 text-xs text-steel-500">
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-accent-600">
                <Mail className="h-3.5 w-3.5" /> {m.email}
              </a>
              {m.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {m.phone}
                </span>
              )}
              {m.company && (
                <span className="inline-flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" /> {m.company}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {formatDate(m.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
