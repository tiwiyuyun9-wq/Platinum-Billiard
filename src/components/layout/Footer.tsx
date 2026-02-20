"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer className="w-full bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16">
            <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    {/* Footer Logo - Matched with Header */}
                    <Link href="/" className="flex items-center space-x-3 shrink-0 group w-fit">
                        <div className="bg-gradient-to-br from-zinc-100 to-zinc-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-500/10 transition-transform group-hover:scale-105 group-hover:shadow-zinc-500/20">
                            <span className="text-zinc-950 font-extrabold text-xl leading-none pt-0.5 font-serif">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight leading-none">
                                Platinum
                            </span>
                            <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-semibold">
                                Billiard
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed text-zinc-500">
                        Destinasi utama bagi pecinta billiard yang mengutamakan kualitas, kenyamanan, dan privasi.
                    </p>
                    <div className="text-sm text-zinc-500 space-y-1">
                        <p>Sokanandi Timur SMP 5 (Perum Kalisemi Indah)</p>
                        <p>Banjarnegara, Jawa Tengah 53413</p>
                        <p className="pt-2 text-emerald-600 font-medium">0852-5748-7828</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Layanan</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Booking Online</Link></li>
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">VVIP Rooms</Link></li>
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Turnamen</Link></li>
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Platinum Lounge</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Support</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Member Terms</Link></li>
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-zinc-100 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Follow Us</h4>
                    <div className="flex space-x-5">
                        <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors transform hover:scale-110">
                            <Instagram className="w-5 h-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors transform hover:scale-110">
                            <Facebook className="w-5 h-5" />
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-zinc-100 transition-colors transform hover:scale-110">
                            <Twitter className="w-5 h-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 pb-24 md:pb-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
                &copy; {new Date().getFullYear()} Platinum Billiard. All rights reserved.
            </div>
        </footer>
    );
}
