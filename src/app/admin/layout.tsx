import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/admin");
    }

    // Role verification (Simple implementation for now)
    // In a real app, you'd check roles table or metadata
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // Check if user has admin access (either via role in profiles or metadata)
    const isAdmin = profile?.role === 'admin' || user.user_metadata?.role === 'admin' || user.email === 'admin@platinumbilliard.com'; // Hardcoded fallback for protection

    if (!isAdmin) {
        // Redirect non-admins to home
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
