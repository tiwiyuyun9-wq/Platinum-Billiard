"use strict";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    return (
        <section className="py-24 bg-zinc-950 relative border-t border-zinc-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/30 rounded-full border border-emerald-900/50">
                                Lokasi Kami
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                                PLATINUM BILLIARD BANJARNEGARA
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Tempat billiard premium di Banjarnegara dengan fasilitas terbaik.
                                Main santai atau kompetitif, kami siap menyambut Anda setiap hari.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/10 transition-colors">
                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">Alamat</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Sokanandi Timur SMP 5 Banjarnegara<br />
                                        Banjarnegara, Jawa Tengah
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/10 transition-colors">
                                    <Clock className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">Jam Operasional</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Buka Setiap Hari: 11.00 - 02.00 WIB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/10 transition-colors">
                                    <MessageCircle className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">Kontak / Reservasi</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        0852-5748-7828 / 0813-3029-4557
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => window.open('https://wa.me/6285257487828', '_blank')}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Hubungi via WhatsApp
                            </Button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="relative aspect-video lg:aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
                        {/* Map Overlay Gradient */}
                        <div className="absolute inset-0 pointer-events-none z-10 border border-white/5 rounded-2xl"></div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.435742232497!2d109.6886!3d-7.4086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7aa96319853361%3A0x6336338e55e3489!2sSMP%20Negeri%205%20Banjarnegara!5e0!3m2!1sid!2sid!4v1684307328000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Lokasi Platinum Billiard Banjarnegara"
                            className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                        ></iframe>
                    </div>

                </div>
            </div>
        </section>
    );
}
