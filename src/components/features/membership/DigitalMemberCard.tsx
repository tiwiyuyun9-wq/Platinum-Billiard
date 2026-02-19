"use client";

import { cn } from "@/lib/utils";
import { Loader2, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";

interface Membership {
    tier: string;
    end_date: string;
    is_active: boolean;
    start_date?: string;
    user_id?: string;
    id?: string;
    created_at?: string;
}

interface DigitalMemberCardProps {
    user: User | null;
    membership: Membership | null;
    loading?: boolean;
}

export function DigitalMemberCard({ user, membership, loading }: DigitalMemberCardProps) {
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setMounted(true), []);

    if (loading || !mounted) {
        return (
            <div className="w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
        );
    }

    const tier = membership?.tier || "Standard";
    const expiryDate = membership?.end_date
        ? new Date(membership.end_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
        : "Lifetime";

    const getCardStyle = (tier: string) => {
        switch (tier.toLowerCase()) {
            case "platinum":
                return {
                    bg: "bg-gradient-to-br from-[#f0f2f5] via-[#e2e8f0] to-[#cbd5e1]", // Lighter silver/white
                    text: "text-[#0f172a]", // Dark Navy/Black
                    accent: "text-[#64748b]",
                    border: "border-white/50",
                    logoBg: "bg-[#0f172a]/5",
                    chipColor: "bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309]",
                    labelColors: "text-[#64748b]" // Muted blue-grey
                };
            case "gold":
                return {
                    bg: "bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#d97706]",
                    text: "text-[#451a03]",
                    accent: "text-[#92400e]",
                    border: "border-[#fcd34d]/50",
                    logoBg: "bg-[#451a03]/5",
                    chipColor: "bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#a16207]",
                    labelColors: "text-[#92400e]/70"
                };
            case "silver":
                return {
                    bg: "bg-gradient-to-br from-[#f4f4f5] via-[#d4d4d8] to-[#a1a1aa]",
                    text: "text-[#18181b]",
                    accent: "text-[#52525b]",
                    border: "border-[#e4e4e7]/50",
                    logoBg: "bg-[#18181b]/5",
                    chipColor: "bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309]",
                    labelColors: "text-[#52525b]"
                };
            default: // Standard
                return {
                    bg: "bg-zinc-950",
                    text: "text-white",
                    accent: "text-zinc-500",
                    border: "border-zinc-800",
                    logoBg: "bg-white/10",
                    chipColor: "bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309]",
                    labelColors: "text-zinc-500"
                };
        }
    };

    const style = getCardStyle(tier);

    return (
        <div className={cn(
            "relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-[24px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl group select-none",
            style.bg,
            "border", style.border
        )}>

            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-soft-light" style={{ transform: 'skewX(-20deg) translateX(-150%)' }}></div>

            <div className="relative h-full px-7 py-6 sm:px-9 sm:py-8 flex flex-col justify-between z-10 w-full">

                {/* Top Row: Logo Text & Icon */}
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col">
                        <div className={cn("flex flex-col leading-none font-bold", style.text)}>
                            <span className="text-xl sm:text-2xl tracking-tighter">Platinum</span>
                            <span className={cn("text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold mt-1 opacity-80")}>BILLIARD</span>
                        </div>
                        <p className={cn("text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-bold mt-1.5 opacity-60", style.labelColors)}>
                            MEMBER CARD
                        </p>
                    </div>
                    {/* Logo Icon Box */}
                    <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 ml-auto", style.logoBg)}>
                        <span className={cn("font-extrabold text-2xl font-serif pt-1", style.text)}>P</span>
                    </div>
                </div>

                {/* Middle Row: Chip, Wifi, Tier */}
                <div className="flex items-center -mt-2 relative w-full pr-1">
                    {/* Chip */}
                    <div className={cn("w-11 h-9 rounded-md shadow-sm relative overflow-hidden border border-black/5 mr-4 shrink-0", style.chipColor)}>
                        {/* Chip Details */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/20"></div>
                        <div className="absolute inset-2 border border-black/20 rounded-[2px]"></div>
                    </div>

                    <Wifi className={cn("w-6 h-6 rotate-90 opacity-60 shrink-0", style.text)} strokeWidth={2.5} />

                    {/* Tier Name */}
                    <div className="ml-auto flex justify-end">
                        <span className={cn(
                            "text-[32px] sm:text-[40px] font-black italic tracking-tighter uppercase transform -skew-x-12 leading-none drop-shadow-sm",
                            style.text
                        )} style={{ fontFamily: 'var(--font-sans)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            {tier}
                        </span>
                    </div>
                </div>

                {/* Bottom Row: Name & Expiry */}
                <div className="flex justify-between items-end w-full">
                    <div className="space-y-0.5 min-w-0 pr-4">
                        <p className={cn("text-[7px] sm:text-[9px] uppercase font-extrabold tracking-widest opacity-60", style.labelColors)}>
                            MEMBER NAME
                        </p>
                        <p className={cn("font-medium text-sm sm:text-lg tracking-widest uppercase truncate max-w-full font-mono", style.text)}>
                            {user?.user_metadata?.full_name || "GUEST"}
                        </p>
                    </div>
                    <div className="text-right space-y-0.5 shrink-0">
                        <p className={cn("text-[7px] sm:text-[9px] uppercase font-extrabold tracking-widest opacity-60", style.labelColors)}>
                            VALID THRU
                        </p>
                        <p className={cn("font-medium text-xs sm:text-base tracking-widest tabular-nums font-mono", style.text)}>
                            {expiryDate}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}
