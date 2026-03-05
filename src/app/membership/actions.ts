"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function downgradeToStandard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Membutuhkan otentikasi." };
    }

    // Set all existing active memberships for this user to inactive/expired
    const { error } = await supabase
        .from("memberships")
        .update({
            is_active: false,
            status: "expired"
        })
        .eq("user_id", user.id)
        .eq("is_active", true);

    if (error) {
        console.error("Error downgrading membership:", error);
        return { error: "Gagal menonaktifkan membership saat ini." };
    }

    revalidatePath("/membership");
    revalidatePath("/admin/memberships");

    return { success: true };
}
