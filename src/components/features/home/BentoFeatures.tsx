import { getStorageUrl } from "@/utils/supabase/storage";
import Image from "next/image";
import { Trophy, Target, Utensils, Armchair, Car } from "lucide-react";

const FEATURES = [
    {
        title: "Meja Rasson Premium",
        description: "Meja turnamen internasional 9-foot dengan performa terbaik.",
        image: getStorageUrl('features/rasson.webp'),
        Icon: Trophy,
        className: "md:col-span-2 md:row-span-2",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Meja Kamui Standar",
        description: "Meja berkualitas tinggi untuk permainan kasual yang seru.",
        image: getStorageUrl('features/kamui.webp'),
        Icon: Target,
        className: "md:col-span-2 md:row-span-2",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Lounge & Menu Lezat",
        description: "Makanan & minuman enak untuk menemani permainan.",
        image: getStorageUrl('features/lounge.jpeg'),
        Icon: Utensils,
        className: "md:col-span-2 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Ruang Tunggu Nyaman",
        description: "Sofa empuk dan area luas untuk bersantai.",
        image: getStorageUrl('features/waiting%20room.jpeg'),
        Icon: Armchair,
        className: "md:col-span-1 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
    {
        title: "Parkir Gratis Luas",
        description: "Area parkir aman dan gratis untuk semua pengunjung.",
        image: getStorageUrl('features/parking%20space.jpeg'),
        Icon: Car,
        className: "md:col-span-1 md:row-span-1",
        bgPattern: "bg-zinc-900",
    },
];

export function BentoFeatures() {
    return (
        <section className="py-16 md:py-24 bg-zinc-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 md:mb-4">
                        Fasilitas Kami
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
                        Kenyamanan bermain dan bersantai adalah prioritas kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(5,200px)] md:grid-rows-2 gap-4 md:gap-5 h-auto md:h-[500px]">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-5 md:p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden relative ${feature.bgPattern} ${feature.className}`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                <Image src={feature.image} alt={feature.title} fill className="object-cover" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                                <div className="bg-zinc-950/50 w-fit p-3 rounded-lg border border-zinc-800/50 backdrop-blur-sm mb-4">
                                    <feature.Icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors drop-shadow-md">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-300 text-sm drop-shadow-md">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
