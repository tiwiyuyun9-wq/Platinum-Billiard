import { createClient } from "./server";

export type MembershipTier = 'silver' | 'gold' | 'platinum';

export interface Membership {
    id: string;
    user_id: string;
    tier: MembershipTier;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export async function getUserMembership(userId: string): Promise<Membership | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        // In case of multiple active memberships, take the one ending latest
        .order("end_date", { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching membership:", error);
    }

    return data;
}
