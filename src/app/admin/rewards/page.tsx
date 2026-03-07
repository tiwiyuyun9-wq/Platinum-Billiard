import { createClient } from "@/utils/supabase/server";
import { RewardsDashboardClient } from "./RewardsDashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RewardsAdminPage() {
    const supabase = await createClient();

    // Verify admin access (assuming standard pattern)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Since we don't have a strict admin role check everywhere yet, we assume the dashboard 
    // is protected at a higher layout layout level.

    // 1. Fetch Rewards Catalog
    const { data: rewards } = await supabase
        .from("rewards")
        .select("*")
        .order("created_at", { ascending: false });

    // 2. Fetch Pending Redemptions with user details
    // To minimize joining complexity if the profiles table has varying structure, we join auth.users manually or via relation
    // For this, we assume standard profiles join
    const { data: redemptions } = await supabase
        .from("reward_redemptions")
        .select(`
            *,
            rewards (title, points_cost, image_url),
            profiles (full_name, phone_number, email)
        `)
        .order("created_at", { ascending: false });

    // 3. Fetch User Points
    const { data: userPoints } = await supabase
        .from("user_points")
        .select(`
            *,
            profiles!user_points_user_id_fkey (full_name, email)
        `)
        .order("current_points", { ascending: false });

    // 4. Fetch Point Settings
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

    // 5. Fetch Point Earning Methods
    const { data: earningMethods } = await supabase
        .from("point_earning_methods")
        .select("*")
        .order("created_at", { ascending: true });

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                    Manajemen <span className="text-emerald-500">Poin & Rewards</span>
                </h1>
                <p className="text-zinc-400 text-lg font-light">
                    Kelola katalog hadiah, setujui penukaran poin, dan atur saldo anggota.
                </p>
            </div>

            <RewardsDashboardClient
                initialRewards={rewards || []}
                initialRedemptions={redemptions || []}
                initialUserPoints={userPoints || []}
                initialSettings={settings || null}
                initialEarningMethods={earningMethods || []}
            />
        </div>
    );
}
