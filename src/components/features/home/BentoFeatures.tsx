"use strict";
import { Tv, Wind, Sofa, Utensils } from "lucide-react";

const FEATURES = [
    {
        title: "Premium Tables",
        description: "Tournament-grade 9-foot tables with Simonis cloth.",
        icon: <div className="w-full h-full bg-emerald-500/20" />, // Placeholder for image
        className: "md:col-span-2 md:row-span-2",
        bgPattern: "bg-gradient-to-br from-zinc-800 to-zinc-900",
    },
    {
        title: "VVIP Rooms",
        description: "Private spaces with exclusive service.",
        icon: <Sofa className="w-8 h-8 text-emerald-400" />,
        className: "md:col-span-1 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Smart Displays",
        description: "4K TVs for live sports match.",
        icon: <Tv className="w-8 h-8 text-emerald-400" />,
        className: "md:col-span-1 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Gourmet Kitchen",
        description: "Chef-curated menu & refreshments.",
        icon: <Utensils className="w-8 h-8 text-emerald-400" />,
        className: "md:col-span-2 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
];

export function BentoFeatures() {
    return (
        <section className="py-24 bg-zinc-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                        World-Class Amenities
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Everything you need for the perfect game night, all under one roof.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden relative ${feature.bgPattern} ${feature.className}`}
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="bg-zinc-950/50 w-fit p-3 rounded-lg border border-zinc-800/50 backdrop-blur-sm mb-4">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm">{feature.description}</p>
                                </div>
                            </div>

                            {/* Decorative Gradient Blob */}
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
