import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-steel-100">
      <AdminSidebar userName={session.user.name ?? session.user.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="admin-scroll flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
