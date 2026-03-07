"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Armchair,
    CreditCard,
    BarChart3,
    LogOut,
    Users,
    Settings,
    Crown,
    MessageSquare,
    Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Manajemen Meja",
        href: "/admin/tables",
        icon: Armchair,
    },
    {
        title: "Booking & Verifikasi",
        href: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Laporan",
        href: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "Pengguna",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Membership",
        href: "/admin/memberships",
        icon: Crown,
    },
    {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: Settings,
    },
    {
        title: "Poin & Rewards",
        href: "/admin/rewards",
        icon: Gift,
    },
    {
        title: "Ulasan",
        href: "/admin/reviews",
        icon: MessageSquare,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="w-64 h-screen bg-zinc-950/95 backdrop-blur-3xl border-r border-white/5 flex flex-col fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-zinc-100 to-zinc-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                        <span className="text-zinc-950 font-extrabold text-xl leading-none pt-0.5 font-serif">P</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold tracking-tight text-lg leading-tight">Admin</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Portal</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300 group relative",
                                isActive
                                    ? "text-emerald-400 bg-gradient-to-r from-emerald-500/10 to-transparent"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            )}
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5 bg-zinc-950/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 font-medium transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Keluar Sistem
                </Button>
            </div>
        </div>
    );
}
