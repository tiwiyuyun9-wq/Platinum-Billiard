import { createClient } from "@/utils/supabase/server";
import ReviewsClient from "./ReviewsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        redirect("/");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    // Fetch all reviews, ordered by latest
    const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
            *,
            profiles:user_id (
                full_name,
                role
            )
        `)
        .order("created_at", { ascending: false });

    return <ReviewsClient initialReviews={reviews || []} />;
}
