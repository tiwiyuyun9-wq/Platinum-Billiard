"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveMembership(membershipId: string) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Membutuhkan otentikasi." };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Akses ditolak." };

    // Fetch the membership to get the user_id
    const { data: membershipToApprove } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("id", membershipId)
        .single();

    if (!membershipToApprove) return { error: "Membership tidak ditemukan." };

    // Deactivate any currently active memberships for this user
    await supabase
        .from("memberships")
        .update({
            is_active: false,
            status: "expired"
        })
        .eq("user_id", membershipToApprove.user_id)
        .eq("is_active", true);

    // Update status to active for the new membership
    const { error } = await supabase
        .from("memberships")
        .update({
            status: "active",
            is_active: true
        })
        .eq("id", membershipId);

    if (error) {
        console.error("Error approving membership:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/memberships");
    return { success: true };
}

export async function rejectMembership(membershipId: string) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Membutuhkan otentikasi." };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Akses ditolak." };

    const { error } = await supabase
        .from("memberships")
        .update({
            status: "rejected",
            is_active: false
        })
        .eq("id", membershipId);

    if (error) {
        console.error("Error rejecting membership:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/memberships");
    return { success: true };
}
