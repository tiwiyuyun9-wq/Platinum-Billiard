"use client";

import Image from "next/image";
import { getStorageUrl } from "@/utils/supabase/storage";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

export function HeroSection() {
    const [status, setStatus] = useState<{ text: string, isOpen: boolean }>({ text: "Memuat...", isOpen: false });

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const currentHour = now.getHours();

            // Operating hours: 11:00 AM - 02:00 AM (Next day)
            // Open if: hour >= 11 (11:00 - 23:59) OR hour < 2 (00:00 - 01:59)
            const isOpen = currentHour >= 11 || currentHour < 2;

            if (isOpen) {
                setStatus({ text: "Buka Sekarang - Tutup 02:00", isOpen: true });
            } else {
                // If closed, it's between 02:00 and 10:59
                // If it's after midnight (02:00 - 10:59), opens today at 11
                const openTime = "11:00";
                setStatus({ text: `Tutup - Buka Hari Ini ${openTime}`, isOpen: false });
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-zinc-950">
            {/* Hero Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={getStorageUrl('hero/hero-homepage.jpg')}
                    alt="Platinum Billiard Hero"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
            </div>

            {/* Background Gradient - Platinum/Metallic Feel */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-zinc-950/80 to-zinc-950 z-0" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] z-0 pointer-events-none" />

            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-100/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 text-center space-y-10 max-w-5xl mx-auto">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-xl ${status.isOpen
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                            }`}
                    >
                        <span className={`flex h-2 w-2 rounded-full mr-2 ${status.isOpen
                            ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"
                            : "bg-zinc-500"
                            }`}></span>
                        {status.text}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl"
                    >
                        The <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">Platinum</span> Standard<br />
                        of Billiards
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-md"
                    >
                        Pengalaman eksklusif bermain billiard dengan meja kualitas turnamen.<br className="hidden md:block" /> Booking online, main tanpa antri.
                    </motion.p>
                </div>

            </div>
        </section>
    );
}
