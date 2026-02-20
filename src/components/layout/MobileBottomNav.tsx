"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CreditCard, User } from "lucide-react";

export function MobileBottomNav() {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname?.startsWith("/admin")) return null;

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Booking", path: "/booking", icon: Calendar },
        { name: "Member", path: "/membership", icon: CreditCard },
        { name: "Profil", path: "/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 pb-safe">
            <nav className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <div
                                className={`flex items-center justify-center p-1.5 rounded-xl transition-all ${isActive ? "bg-emerald-500/10" : ""
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "fill-emerald-500/20" : ""}`} />
                            </div>
                            <span className={`text-[10px] font-medium tracking-wide ${isActive ? "font-bold" : ""}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
