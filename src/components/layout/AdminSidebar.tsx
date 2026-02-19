"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Armchair,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    Users
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
        title: "Users & Member",
        href: "/admin/users",
        icon: Users,
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
        <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <span className="font-serif font-extrabold text-zinc-950 text-xl pt-1">P</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold leading-none">Admin</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Panel</span>
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
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-white")} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-zinc-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Keluar
                </Button>
            </div>
        </div>
    );
}
