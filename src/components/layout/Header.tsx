"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
// import { getUserMembership } from "@/utils/supabase/membership"; // Don't import this, it has server code
import { CreditCard, LogOut, Settings, User as UserIcon, Gift, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Membership } from "@/utils/supabase/membership-types";
import { AuthModal } from "@/components/auth/AuthModal";
import { User } from "@supabase/supabase-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
    const pathname = usePathname();
    // Client-side state for user & membership to avoid hydration mismatch
    const [user, setUser] = useState<User | null>(null);
    const [membership, setMembership] = useState<Membership | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    if (pathname?.startsWith("/admin")) return null;

    useEffect(() => {
        const supabase = createClient();

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            fetchMembership(user?.id);

            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();
                setIsAdmin(data?.role === 'admin' || user.email === 'admin@platinumbilliard.com' || user.user_metadata?.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        };

        const fetchMembership = async (userId: string | undefined) => {
            if (!userId) {
                setMembership(null);
                return;
            }
            const { data } = await supabase
                .from("memberships")
                .select("*")
                .eq("user_id", userId)
                .eq("is_active", true)
                .order("end_date", { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setMembership(data as Membership);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            fetchMembership(session?.user?.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.reload();
    };

    const brandColors: Record<string, string> = {
        standard: "bg-zinc-800 text-zinc-300 border-zinc-700",
        silver: "bg-zinc-300 text-zinc-900 border-zinc-400",
        gold: "bg-amber-400 text-amber-950 border-amber-500",
        platinum: "bg-zinc-100 text-zinc-950 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]",
    };

    return (
        <header className="fixed top-0 z-50 w-full pt-6 px-4 pr-[calc(1rem+var(--removed-body-scroll-bar-size,0px))] transition-[padding]">
            <div className="container mx-auto">
                <div className="mx-auto w-full max-w-7xl rounded-full border border-white/10 bg-zinc-950/70 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/30 px-6 h-20 flex items-center justify-between transition-all duration-500 hover:border-white/20 hover:bg-zinc-950/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">

                    {/* Logo - Refined */}
                    <Link href="/" className="flex items-center space-x-3 shrink-0 group">
                        <div className="bg-gradient-to-br from-zinc-100 to-zinc-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-500/10 transition-transform group-hover:scale-105 group-hover:shadow-zinc-500/20">
                            <span className="text-zinc-950 font-extrabold text-xl leading-none pt-0.5 font-serif">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="hidden sm:inline-block text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight leading-none">
                                Platinum
                            </span>
                            <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-semibold">
                                Billiard
                            </span>
                        </div>
                    </Link>

                    {/* Navigation - Polished */}
                    <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors relative group py-2">
                            Home
                            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                        </Link>
                        <Link href="/reservasi" className="hover:text-white transition-colors relative group py-2">
                            Booking
                            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                        </Link>
                        <Link href="/membership" className="hover:text-white transition-colors relative group py-2">
                            Membership
                            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                        </Link>
                        <Link href="/tournament" className="hover:text-white transition-colors relative group py-2">
                            Tournament
                            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                        </Link>
                    </nav>

                    {/* Actions - Enterprise Buttons */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {membership && (
                                    <Badge variant="outline" className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-wider ${brandColors[membership.tier] || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                                        <CreditCard className="w-3.5 h-3.5" />
                                        {membership.tier}
                                    </Badge>
                                )}

                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <div className="relative cursor-pointer">
                                            <Avatar className="h-9 w-9 border border-zinc-700 transition-all hover:border-emerald-500/50">
                                                <AvatarImage src={user.user_metadata?.avatar_url} />
                                                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950"></div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-200">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none text-white">{user.user_metadata?.full_name || "User"}</p>
                                                <p className="text-xs leading-none text-zinc-500 truncate">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer group" asChild>
                                            <Link href="/profile">
                                                <UserIcon className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer group" asChild>
                                            <Link href="/my-membership">
                                                <CreditCard className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                                                <span>Membership</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {isAdmin && (
                                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer group" asChild>
                                                <Link href="/admin">
                                                    <Shield className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-indigo-400" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer group" asChild>
                                            <Link href="/profile?tab=settings">
                                                <Settings className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer group" asChild>
                                            <Link href="/rewards">
                                                <Gift className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-amber-400" />
                                                <span>Points & Rewards</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                        <DropdownMenuItem
                                            className="focus:bg-red-950/30 focus:text-red-400 text-red-400 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <div className="hidden sm:flex items-center bg-zinc-900/50 rounded-full p-1 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-sm">
                                    <button
                                        onClick={() => {
                                            setAuthMode("login");
                                            setAuthOpen(true);
                                        }}
                                        className="px-6 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all rounded-full"
                                    >
                                        Masuk
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAuthMode("register");
                                            setAuthOpen(true);
                                        }}
                                        className="px-6 py-2 text-sm font-bold text-zinc-950 bg-gradient-to-tr from-white to-zinc-200 hover:to-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all scale-105"
                                    >
                                        Daftar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <AuthModal
                        open={authOpen}
                        onOpenChange={setAuthOpen}
                        defaultMode={authMode}
                    />

                </div>
            </div>
        </header>
    );
}
