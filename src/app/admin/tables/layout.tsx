"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, Settings } from "lucide-react";

export default function TablesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        {
            name: "Live View",
            href: "/admin/tables/live",
            icon: LayoutGrid
        },
        {
            name: "Pengaturan Meja",
            href: "/admin/tables/settings",
            icon: Settings
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
                        Manajemen Meja
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        Pantau status meja secara live dan atur konfigurasi meja billiard.
                    </p>
                </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex bg-zinc-900/50 p-1 rounded-xl w-fit border border-white/5">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                                isActive
                                    ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/10"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "")} />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Header di Live Page sudah ada H1, kita biarkan layout ini hanya render navigation agar tidak double H1 */}
            {/* children = page content (live / settings) */}
            <div className="pt-2">
                {children}
            </div>
        </div>
    );
}
