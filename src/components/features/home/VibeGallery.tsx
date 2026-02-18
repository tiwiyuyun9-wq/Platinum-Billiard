"use strict";
import Image from "next/image";

const VIBE_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop",
        alt: "Professional Billiard Table",
        className: "col-span-12 md:col-span-8 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1563220054-04d2b2707255?q=80&w=2000&auto=format&fit=crop",
        alt: "Bar & Lounge Area",
        className: "col-span-12 md:col-span-4 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1628173005527-dc599503487c?q=80&w=2000&auto=format&fit=crop",
        alt: "Premium Ambience",
        className: "col-span-12 md:col-span-4 row-span-1",
    },
];

export function VibeGallery() {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-4">
                        The Platinum Vibe
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Experience the sophisticated atmosphere designed for serious players and social gatherings alike.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-4 h-[600px] md:h-[500px]">
                    {VIBE_IMAGES.map((image, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl overflow-hidden group border border-zinc-800/50 hover:border-zinc-700 transition-colors ${image.className}`}
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
