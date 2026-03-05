import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MembershipsClient from "./MembershipsClient";

export const dynamic = "force-dynamic";

export default async function AdminMembershipsPage() {
    const supabase = await createClient();

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/");

    // Fetch pending memberships
    const { data: pendingMemberships, error: pendingError } = await supabase
        .from("memberships")
        .select(`
            *,
            profiles:user_id ( full_name )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

    if (pendingError) {
        console.error("Error fetching pending memberships:", pendingError);
    }

    // Fetch active memberships
    const { data: activeMemberships, error: activeError } = await supabase
        .from("memberships")
        .select(`
            *,
            profiles:user_id ( full_name )
        `)
        .eq("status", "active")
        .order("start_date", { ascending: false });

    if (activeError) {
        console.error("Error fetching active memberships:", activeError);
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <MembershipsClient
                pendingMemberships={pendingMemberships || []}
                activeMemberships={activeMemberships || []}
            />
        </div>
    );
}
