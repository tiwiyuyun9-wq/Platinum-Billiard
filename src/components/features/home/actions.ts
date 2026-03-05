"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(rating: number, content: string, mediaUrls: string[] = []) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Anda harus login untuk memberikan ulasan." };
    }

    if (rating < 1 || rating > 5) {
        return { error: "Rating tidak valid." };
    }

    if (!content.trim()) {
        return { error: "Ulasan tidak boleh kosong." };
    }

    const { error } = await supabase
        .from("reviews")
        .insert({
            user_id: user.id,
            rating,
            content,
            media_urls: mediaUrls
        });

    if (error) {
        console.error("Error submitting review:", error);
        return { error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}
