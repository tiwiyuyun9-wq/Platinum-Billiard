"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
}

export async function replyToReview(reviewId: string, replyContent: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("reviews")
        .update({
            admin_reply: replyContent,
            admin_reply_at: new Date().toISOString()
        })
        .eq("id", reviewId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
}
