"use strict";
"use client";

import { MembershipCard } from "@/components/features/membership/MembershipCard";

const MEMBERSHIP_TIERS = [
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

export default function MembershipPage() {
    const handleBuy = (tier: string) => {
        // For now, redirect to WhatsApp
        const message = `Halo Admin Platinum, saya tertarik join membership tier ${tier}.`;
        window.open(`https://wa.me/6285257487828?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Platinum <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-transparent">Membership</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Bergabunglah dengan komunitas eksklusif kami dan nikmati privilege tanpa batas.
                        Main lebih hemat, layanan prioritas, dan akses VVIP.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {MEMBERSHIP_TIERS.map((tier) => (
                        <MembershipCard
                            key={tier.tier}
                            tier={tier.tier}
                            price={tier.price}
                            period={tier.period}
                            benefits={[...tier.benefits]}
                            recommended={tier.recommended}
                            onBuy={() => handleBuy(tier.tier)}
                        />
                    ))}
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
