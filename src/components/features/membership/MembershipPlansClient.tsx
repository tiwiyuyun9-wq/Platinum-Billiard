"use client";

import { useState } from "react";
import { MembershipCard } from "@/components/features/membership/MembershipCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { MembershipPaymentModal } from "@/components/features/membership/MembershipPaymentModal";
import { DowngradeConfirmationModal } from "@/components/features/membership/DowngradeConfirmationModal";

interface MembershipPlansClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    currentTierName: string | null;
    membershipTiers: readonly {
        tier: "Standard" | "Silver" | "Gold" | "Platinum";
        price: string;
        period: string;
        benefits: readonly string[];
        recommended: boolean;
    }[];
}

export function MembershipPlansClient({ user, currentTierName, membershipTiers }: MembershipPlansClientProps) {
    const [authOpen, setAuthOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [downgradeModalOpen, setDowngradeModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const handleJoinClick = (tier: string, price: string) => {
        if (!user) {
            setAuthOpen(true);
            return;
        }

        if (tier.toLowerCase() === "standard") {
            // Already standard? Do nothing (button should be disabled anyway)
            if (currentTierName === "standard") return;
            // Otherwise, open downgrade confirmation
            setDowngradeModalOpen(true);
        } else {
            // Paid tiers
            setSelectedTier(tier);
            setSelectedPrice(price);
            setPaymentModalOpen(true);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {membershipTiers.map((tier) => {
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
                                    tier={tier.tier}
                                    price={tier.price}
                                    period={tier.period}
                                    benefits={[...tier.benefits]}
                                    recommended={tier.recommended}
                                    disabled={isCurrentPlan}
                                    ctaText={isCurrentPlan ? "Plan Saat Ini" : `Join ${tier.tier}`}
                                    onBuy={() => handleJoinClick(tier.tier, tier.price)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <AuthModal
                open={authOpen}
                onOpenChange={setAuthOpen}
                defaultMode="register"
            />

            <MembershipPaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                tier={selectedTier}
                price={selectedPrice}
                user={user}
            />

            <DowngradeConfirmationModal
                isOpen={downgradeModalOpen}
                onClose={() => setDowngradeModalOpen(false)}
            />
        </>
    );
}
