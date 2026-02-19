import { createClient } from "@/utils/supabase/server";
import { MembershipCard } from "@/components/features/membership/MembershipCard";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MEMBERSHIP_TIERS = [
    {
        tier: "Standard",
        price: "Gratis",
        period: "selamanya",
        benefits: [
            "Akses Booking Online",
            "Poin Reward Standar",
            "Profil Member Digital",
        ],
        recommended: false,
    },
    {
        tier: "Silver",
        price: "Rp 100rb",
        period: "bulan",
        benefits: [
            "Diskon 10% sewa meja (Siang hari)",
            "Booking H-1",
            "Poin reward standar",
        ],
        recommended: false,
    },
    {
        tier: "Gold",
        price: "Rp 250rb",
        period: "bulan",
        benefits: [
            "Diskon 15% sewa meja (All Day)",
            "Prioritas Booking H-3",
            "Gratis Minuman Ringan (1x/visit)",
            "Akses Locker Pribadi",
            "Poin Reward 2x lipat",
        ],
        recommended: true,
    },
    {
        tier: "Platinum",
        price: "Rp 500rb",
        period: "bulan",
        benefits: [
            "Diskon 25% sewa meja (All Day)",
            "VVIP Room Access (Tanpa surcharge)",
            "Prioritas Booking H-7",
            "Gratis Makan & Minum (Limit Rp 50rb/visit)",
            "Undangan Turnamen Eksklusif",
            "Personal Cue Storage",
        ],
        recommended: false,
    },
] as const;

export default async function MembershipPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch active membership if user is logged in
    let activeMembership = null;
    if (user) {
        const { data } = await supabase
            .from("memberships")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("end_date", { ascending: false })
            .limit(1)
            .single();
        activeMembership = data;
    }

    // Default to 'standard' if no active paid membership found but user exists
    // (Assuming everyone has at least standard upon registration conceptually, 
    // but db might be empty if we didn't insert it. Let's treat null as Standard for UI)
    const currentTierName = activeMembership?.tier || (user ? "standard" : null);

    const handleBuyLink = (tier: string) => {
        const message = `Halo Admin Platinum, saya tertarik join membership tier ${tier}.`;
        return `https://wa.me/6285257487828?text=${encodeURIComponent(message)}`;
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-40 pb-20">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="text-center space-y-6 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Platinum <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-transparent">Membership</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Bergabunglah dengan komunitas eksklusif kami dan nikmati privilege tanpa batas.
                    </p>
                </div>

                {/* ACTIVE MEMBERSHIP HERO (If Logged In) */}
                {user && (
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 shadow-2xl">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-4 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-sm font-medium text-emerald-400">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Status: Aktif
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                                        Membership Anda: <span className="text-amber-400 capitalize">{currentTierName}</span>
                                    </h2>
                                    {activeMembership ? (
                                        <p className="text-zinc-400">
                                            Berlaku hingga <span className="text-white font-bold">{new Date(activeMembership.end_date).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
                                        </p>
                                    ) : (
                                        <p className="text-zinc-400">
                                            Nikmati benefit dasar sebagai member Standard. Upgrade sekarang untuk lebih banyak keuntungan!
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-4 border-zinc-800 flex items-center justify-center shadow-inner">
                                        {currentTierName === 'platinum' ? <Crown className="w-12 h-12 text-zinc-300" /> :
                                            currentTierName === 'gold' ? <Crown className="w-12 h-12 text-amber-500" /> :
                                                currentTierName === 'silver' ? <Shield className="w-12 h-12 text-zinc-400" /> :
                                                    <Star className="w-12 h-12 text-zinc-600" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {MEMBERSHIP_TIERS.map((tier) => {
                        const isCurrentPlan = tier.tier.toLowerCase() === currentTierName;
                        return (
                            <div key={tier.tier} className={`relative flex flex-col h-full ${isCurrentPlan ? 'opacity-100 ring-2 ring-emerald-500 rounded-2xl' : 'opacity-100'}`}>
                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg">
                                        PLAN SAAT INI
                                    </div>
                                )}
                                <div className={isCurrentPlan ? "pointer-events-none" : ""}>
                                    <MembershipCard
                                        tier={tier.tier as any}
                                        price={tier.price}
                                        period={tier.period}
                                        benefits={[...tier.benefits]}
                                        recommended={tier.recommended}
                                        disabled={isCurrentPlan}
                                        ctaText={isCurrentPlan ? "Plan Saat Ini" : `Join ${tier.tier}`}
                                        buyLink={!isCurrentPlan ? handleBuyLink(tier.tier) : undefined}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-zinc-500 text-sm">
                        *Syarat dan ketentuan berlaku. Keanggotaan dapat dibatalkan kapan saja.
                    </p>
                </div>
            </div>
        </main>
    );
}
