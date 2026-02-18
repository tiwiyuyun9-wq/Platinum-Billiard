
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
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
                            Reservasi Meja
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-zinc-100 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </Link>
                        <Link href="#" className="hover:text-zinc-100 transition-colors relative group">
                            Lokasi
                            <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-zinc-100 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-4" asChild>
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button size="sm" className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-full px-5 shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform hover:scale-105" asChild>
                            <Link href="/register">Join Member</Link>
                        </Button>
                    </div>

                </div>
            </div>
        </header>
    );
}
