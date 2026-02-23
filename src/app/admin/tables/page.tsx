import { redirect } from "next/navigation";

export default function TablesRootPage() {
    // Automatically redirect /admin/tables to the live view tab
    redirect("/admin/tables/live");
}
