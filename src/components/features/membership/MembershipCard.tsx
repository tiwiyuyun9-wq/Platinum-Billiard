"use strict";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
    tier: "Silver" | "Gold" | "Platinum";
    price: string;
    period: string;
    benefits: string[];
    recommended?: boolean;
    onBuy: () => void;
}

const tierStyles = {
    Silver: {
        borderColor: "border-zinc-700",
        bgColor: "bg-zinc-900/50",
        textColor: "text-zinc-300",
        buttonVariant: "outline" as const,
    },
    Gold: {
        borderColor: "border-amber-500/50",
        bgColor: "bg-gradient-to-b from-amber-500/10 to-zinc-900/50",
        textColor: "text-amber-400",
        buttonVariant: "default" as const, // We'll override style
    },
    Platinum: {
        borderColor: "border-zinc-400/50",
        bgColor: "bg-gradient-to-b from-zinc-300/10 to-zinc-900/50",
        textColor: "text-zinc-100",
        buttonVariant: "default" as const,
    },
};

export function MembershipCard({ tier, price, period, benefits, recommended, onBuy }: MembershipCardProps) {
    const styles = tierStyles[tier];

    return (
        <div className={cn(
            "relative p-8 rounded-2xl border transition-all duration-300 flex flex-col h-full",
            styles.borderColor,
            styles.bgColor,
            recommended ? "shadow-[0_0_40px_rgba(245,158,11,0.15)] scale-105 z-10" : "hover:border-zinc-500 hover:shadow-lg"
        )}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                </div>
            )}

            <div className="mb-8 text-center">
                <h3 className={cn("text-xl font-bold mb-2 uppercase tracking-widest", styles.textColor)}>
                    {tier}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    <span className="text-zinc-500">/{period}</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className={cn("mt-1 p-0.5 rounded-full bg-zinc-800", styles.textColor.replace('text-', 'bg-').replace('300', '900').replace('400', '900/20'))}>
                            <Check className={cn("w-3 h-3", styles.textColor)} />
                        </div>
                        <span className="text-zinc-300 text-sm leading-relaxed">{benefit}</span>
                    </li>
                ))}
            </ul>

            <Button
                className={cn(
                    "w-full font-bold tracking-wide",
                    tier === 'Gold' ? "bg-amber-500 hover:bg-amber-600 text-black" :
                        tier === 'Platinum' ? "bg-white hover:bg-zinc-200 text-black" :
                            "border-zinc-700 hover:bg-zinc-800 text-white"
                )}
                variant={styles.buttonVariant === 'outline' ? 'outline' : 'default'}
                onClick={onBuy}
            >
                Join {tier}
            </Button>
        </div>
    );
}
