import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { getUserMembership } from "@/utils/supabase/membership";
import { User, LogOut, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const membership = user ? await getUserMembership(user.id) : null;

    const brandColors = {
        silver: "bg-zinc-300 text-zinc-900 border-zinc-400",
        gold: "bg-amber-400 text-amber-950 border-amber-500",
        platinum: "bg-zinc-100 text-zinc-950 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]",
    };

    return (
        <header className="fixed top-0 z-50 w-full pt-4 px-4">
            <div className="container mx-auto">
                <div className="mx-auto w-full max-w-5xl rounded-full border border-zinc-800 bg-zinc-950/70 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/40 px-6 h-16 flex items-center justify-between transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-950/80">

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 shrink-0">
                        <div className="bg-gradient-to-br from-zinc-100 to-zinc-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-500/20">
                            <span className="text-zinc-950 font-bold text-lg leading-none pt-0.5">P</span>
                        </div>
                        <span className="hidden sm:inline-block text-lg font-bold bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-100 bg-clip-text text-transparent tracking-tight">
                            Platinum Billiard
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <Link href="/" className="hover:text-zinc-100 transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-zinc-100 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </Link>
                        <Link href="/reservasi" className="hover:text-zinc-100 transition-colors relative group">
                            Booking
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-zinc-100 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </Link>
                        <Link href="/membership" className="hover:text-zinc-100 transition-colors relative group">
                            Membership
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-zinc-100 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </Link>

                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {membership ? (
                                    <Badge variant="outline" className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${brandColors[membership.tier] || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                                        <CreditCard className="w-3 h-3" />
                                        {membership.tier}
                                    </Badge>
                                ) : (
                                    <Button size="sm" variant="outline" className="hidden sm:flex border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-full h-8 text-xs" asChild>
                                        <Link href="/membership">Upgrade</Link>
                                    </Button>
                                )}

                                <form action="/auth/signout" method="post">
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8">
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-4" asChild>
                                    <Link href="/login">Masuk</Link>
                                </Button>
                                <Button size="sm" className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-full px-5 shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform hover:scale-105" asChild>
                                    <Link href="/register">Join Member</Link>
                                </Button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
