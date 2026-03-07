"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ==========================================
// REWARDS CATALOG MANAGEMENT
// ==========================================

export async function createReward(formData: FormData) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const points_cost = parseInt(formData.get("points_cost") as string);
    const stock = parseInt(formData.get("stock") as string);
    const image_url = formData.get("image_url") as string || null;
    const is_active = formData.get("is_active") === "true";

    if (!title || isNaN(points_cost)) {
        return { error: "Judul dan Harga Poin harus diisi valid" };
    }

    const { error } = await supabase.from("rewards").insert({
        title,
        description,
        points_cost,
        stock: isNaN(stock) ? -1 : stock,
        image_url,
        is_active
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}

export async function updateReward(id: string, formData: FormData) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const points_cost = parseInt(formData.get("points_cost") as string);
    const stock = parseInt(formData.get("stock") as string);
    const image_url = formData.get("image_url") as string || null;
    const is_active = formData.get("is_active") === "true";

    if (!title || isNaN(points_cost)) {
        return { error: "Judul dan Harga Poin harus diisi valid" };
    }

    const { error } = await supabase.from("rewards").update({
        title,
        description,
        points_cost,
        stock: isNaN(stock) ? -1 : stock,
        image_url,
        is_active
    }).eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}

export async function deleteReward(id: string) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase.from("rewards").delete().eq("id", id);

    if (error) return { error: "Gagal menghapus reward (Mungkin sudah ada yang klaim? Set ke tidak aktif saja)." };

    revalidatePath("/admin/rewards");
    return { success: true };
}

// ==========================================
// REDEMPTION MANAGEMENT
// ==========================================

export async function updateRedemptionStatus(redemptionId: string, status: 'fulfilled' | 'rejected', pointsCost: number, userId: string) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Update status
    const { error } = await supabase.from("reward_redemptions").update({ status }).eq("id", redemptionId);
    if (error) return { error: error.message };

    // If rejected, refund the points
    if (status === 'rejected') {
        const { error: refundError } = await supabase.from("point_history").insert({
            user_id: userId,
            amount: pointsCost,
            description: "Pengembalian Poin: Penukaran Reward Ditolak"
        });
        if (refundError) return { error: "Gagal mengembalikan poin" };
    }

    revalidatePath("/admin/rewards");
    return { success: true };
}

// ==========================================
// MANUAL POINTS ADJUSTMENT
// ==========================================

export async function adjustUserPoints(userId: string, amount: number, description: string) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    if (!amount || amount === 0 || !description) {
        return { error: "Nominal poin dan deskripsi harus diisi" };
    }

    const { error } = await supabase.from("point_history").insert({
        user_id: userId,
        amount,
        description: `(Admin Adjustment) ${description}`
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    revalidatePath("/admin/users");
    return { success: true };
}

// ==========================================
// SETTINGS MANAGEMENT
// ==========================================

export async function updatePointSettings(formData: FormData) {
    const supabase = await createClient();

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const points_per_booking = parseInt(formData.get("points_per_booking") as string) || 0;
    const points_per_order = parseInt(formData.get("points_per_order") as string) || 0;

    const { error } = await supabase.from("settings").update({
        points_per_booking,
        points_per_order
    }).eq("id", 1); // Assuming single row

    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}

// ==========================================
// EARNING METHODS MANAGEMENT
// ==========================================

export async function createEarningMethod(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;

    if (!title || !description) return { error: "Judul dan deskripsi harus diisi" };

    const { error } = await supabase.from("point_earning_methods").insert({ title, description, icon });
    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}

export async function updateEarningMethod(id: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;

    if (!title || !description) return { error: "Judul dan deskripsi harus diisi" };

    const { error } = await supabase.from("point_earning_methods").update({ title, description, icon }).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}

export async function deleteEarningMethod(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase.from("point_earning_methods").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/rewards");
    return { success: true };
}
