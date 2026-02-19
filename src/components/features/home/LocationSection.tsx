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
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                                Find Us
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Located in the heart of the city, Platinum Billiard offers easy access and ample parking.
                                Whether you&apos;re dropping by for a quick game or booking a VIP room for the evening, we&apos;re ready to welcome you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Location</h3>
                                    <p className="text-zinc-400">
                                        Jl. Jend. Sudirman No. 123, Jakarta Selatan<br />
                                        (Sebelah Grand Mall)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                                    <Clock className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Operating Hours</h3>
                                    <p className="text-zinc-400">
                                        Mon - Sun: 10:00 AM - 02:00 AM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-8 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02]"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Contact via WhatsApp
                            </Button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="relative aspect-video lg:aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                        {/* Replace with actual Google Maps Embed if available */}
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
                            <span className="text-zinc-500 font-medium">Google Maps Embed Placeholder</span>
                        </div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28317373805!2d106.75628551465225!3d-6.229720935372373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Special%20Capital%20Region%20of%20Jakarta!5e0!3m2!1sen!2sid!4v1647844002672!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Platinum Billiard Location"
                            className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        ></iframe>
                    </div>

                </div>
            </div>
        </section>
    );
}
