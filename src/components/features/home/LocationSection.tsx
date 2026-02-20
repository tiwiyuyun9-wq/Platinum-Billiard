"use client";
import { MessageCircle, MapPin, Clock, Phone, ArrowRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col xl:flex-row gap-16 items-center">

                        {/* Text Content */}
                        <div className="flex-1 space-y-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Lokasi Utama</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                                    Kunjungi <br className="hidden sm:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
                                        Platinum Billiard
                                    </span>
                                </h2>
                                <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-xl">
                                    Area parkir luas, fasilitas premium, dan meja standar turnamen menunggu Anda. Temukan pengalaman bermain billiard terbaik di Banjarnegara.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
                                {/* Card 1: Alamat */}
                                <div className="group p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-500 shadow-xl shadow-black/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold text-zinc-100 mb-2 text-lg">Alamat</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                        Sokanandi Timur SMP 5<br /> Banjarnegara, Jawa Tengah
                                    </p>
                                </div>

                                {/* Card 2: Jam Operasional */}
                                <div className="group p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-500 shadow-xl shadow-black/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-inner">
                                        <Clock className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold text-zinc-100 mb-2 text-lg">Jam Operasional</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                        Buka Setiap Hari<br />
                                        <span className="text-emerald-400 font-bold tracking-wide">11.00 - 02.00 WIB</span>
                                    </p>
                                </div>

                                {/* Card 3: Kontak (Full Width) */}
                                <div className="group sm:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-white/5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-500 shadow-xl shadow-black/20 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-colors duration-500"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white mb-1.5 text-lg">Butuh Bantuan Navigasi?</h3>
                                            <p className="text-sm font-medium text-zinc-400 tracking-wide">
                                                0852-5748-7828 <span className="text-zinc-600 mx-2">|</span> 0813-3029-4557
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-zinc-950 rounded-full px-8 h-12 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300 relative z-10 hover:-translate-y-0.5"
                                        onClick={() => window.open('https://wa.me/6285257487828', '_blank')}
                                    >
                                        Chat WhatsApp
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Map Container - Enterprise Frame */}
                        <div className="flex-1 w-full max-w-2xl xl:max-w-none mx-auto relative perspective-1000">

                            {/* Glow behind map */}
                            <div className="absolute -inset-4 bg-gradient-to-b from-zinc-800 to-zinc-950 opacity-40 blur-2xl -z-10 rounded-[3rem]"></div>

                            <div className="relative rounded-[2.5rem] p-3 bg-gradient-to-b from-zinc-800/80 to-zinc-950/80 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl group transform-gpu transition-all duration-700 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">

                                {/* Top bar of the frame (like a browser or UI window) */}
                                <div className="h-8 flex items-center px-4 gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-white/5 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] xl:aspect-[4/4] bg-zinc-950">

                                    {/* Open in maps overlay */}
                                    <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-md mb-2">
                                                <Navigation className="w-8 h-8 text-emerald-400" />
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8 h-12 font-bold backdrop-blur-md"
                                                onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Sokanandi+Timur+SMP+5+Banjarnegara', '_blank')}
                                            >
                                                Buka di Aplikasi Maps
                                            </Button>
                                        </div>
                                    </div>

                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.435742232497!2d109.6886!3d-7.4086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa96319853361%3A0x6336338e55e3489!2sSMP%20Negeri%205%20Banjarnegara!5e0!3m2!1sid!2sid!4v1684307328000!5m2!1sid!2sid"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        title="Lokasi Platinum Billiard Banjarnegara"
                                        className="absolute inset-0 w-full h-full grayscale-[60%] contrast-125 brightness-75 group-hover:grayscale-[20%] group-hover:brightness-100 transition-all duration-1000 ease-in-out group-hover:scale-105 origin-center"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Decorative element below map */}
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs tracking-wider text-zinc-500 font-bold uppercase">
                                <span className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Buka Sekarang
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                                    Parkir Luas
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                                    Pusat Kota
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
