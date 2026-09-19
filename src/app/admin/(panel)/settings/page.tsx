import { AdminHeader } from "@/components/admin/FormField";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <AdminHeader
        title="Site settings"
        description="Brand, homepage copy, contact details and links used across the site."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
