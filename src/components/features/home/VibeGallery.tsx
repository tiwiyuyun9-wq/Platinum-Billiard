"use strict";
import Image from "next/image";

import { getStorageUrl } from "@/utils/supabase/storage";

const VIBE_IMAGES = [
    {
        src: getStorageUrl("vibe/Rasson%20Premium.webp"),
        alt: "Professional Billiard Table",
        className: "col-span-12 md:col-span-8 row-span-2",
    },
    {
        src: getStorageUrl("vibe/bar%20and%20lounge.jpg"),
        alt: "Bar & Lounge Area",
        className: "col-span-12 md:col-span-4 row-span-1",
    },
    {
        src: getStorageUrl("vibe/ambience.jpeg"),
        alt: "Premium Ambience",
        className: "col-span-12 md:col-span-4 row-span-1",
    },
];

export function VibeGallery() {
    return (
        <section className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-3 md:mb-4">
                        Atmosfer Platinum
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg px-4 sm:px-0">
                        Rasakan suasana berkelas yang dirancang untuk pemain serius maupun sekadar bersantai.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 h-auto md:h-[500px]">
                    {VIBE_IMAGES.map((image, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl overflow-hidden group border border-zinc-800/50 hover:border-zinc-700 transition-colors h-[250px] sm:h-[300px] md:h-auto ${image.className}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
