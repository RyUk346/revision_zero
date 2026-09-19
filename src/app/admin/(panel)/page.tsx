import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  Newspaper,
  Users,
  Briefcase,
  Mail,
  CalendarClock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/FormField";
import { formatDateShort } from "@/lib/utils";

export default async function AdminDashboard() {
  const [
    projects,
    services,
    news,
    team,
    jobs,
    unreadMessages,
    totalMessages,
    newCalls,
    newApplications,
    recentMessages,
    recentCalls,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.newsPost.count(),
    prisma.teamMember.count(),
    prisma.jobPosting.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.contactSubmission.count(),
    prisma.callRequest.count({ where: { status: "new" } }),
    prisma.jobApplication.count({ where: { status: "new" } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.callRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Projects", value: projects, href: "/admin/projects", icon: FolderKanban },
    { label: "Services", value: services, href: "/admin/services", icon: Wrench },
    { label: "News posts", value: news, href: "/admin/news", icon: Newspaper },
    { label: "Team members", value: team, href: "/admin/team", icon: Users },
    { label: "Open roles", value: jobs, href: "/admin/careers", icon: Briefcase },
    { label: "Unread messages", value: unreadMessages, href: "/admin/messages", icon: Mail, highlight: unreadMessages > 0 },
    { label: "New call requests", value: newCalls, href: "/admin/calls", icon: CalendarClock, highlight: newCalls > 0 },
    { label: "New applications", value: newApplications, href: "/admin/applications", icon: FileText, highlight: newApplications > 0 },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your site content and recent activity."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const I = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`card flex flex-col gap-3 p-5 transition-shadow hover:shadow-md ${
                s.highlight ? "ring-1 ring-accent-300" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.highlight ? "bg-accent-500 text-white" : "bg-steel-100 text-steel-600"}`}>
                  <I className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-steel-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-900">{s.value}</p>
                <p className="text-sm text-steel-500">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent messages */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
            <h2 className="font-bold text-steel-900">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-steel-100">
            {recentMessages.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-steel-400">No messages yet.</li>
            )}
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-steel-900">
                    {m.name} {!m.read && <span className="ml-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-700">New</span>}
                  </p>
                  <p className="truncate text-sm text-steel-500">{m.subject || m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-steel-400">{formatDateShort(m.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent calls */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
            <h2 className="font-bold text-steel-900">Recent call requests</h2>
            <Link href="/admin/calls" className="text-sm font-semibold text-accent-600 hover:text-accent-700">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-steel-100">
            {recentCalls.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-steel-400">No call requests yet.</li>
            )}
            {recentCalls.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-steel-900">{c.name}</p>
                  <p className="truncate text-sm text-steel-500">
                    {c.topic || "General enquiry"}
                    {c.preferredDate ? ` · ${c.preferredDate}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-steel-400">{formatDateShort(c.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
