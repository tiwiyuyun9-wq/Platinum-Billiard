"use client";

import { useState } from "react";
import { TableCard } from "@/components/features/tables/TableCard";
import { Info } from "lucide-react";
import { BookingModal } from "@/components/features/booking/BookingModal";
import { getStorageUrl } from "@/utils/supabase/storage";


// Mock Data - Adjusted to Night Rates (Standard)
const MOCK_TABLES = [
    // Rasson Tables (1-4)
    { id: "1", name: "Meja Rasson 01", status: "available", price: 35000, imageUrl: getStorageUrl('tables/rasson-1.jpg') },
    { id: "2", name: "Meja Rasson 02", status: "occupied", price: 35000, timePlayedStart: new Date(Date.now() - 45 * 60 * 1000).toISOString(), bookedUntil: "21:30 WIB", imageUrl: getStorageUrl('tables/rasson-2.jpg') },
    { id: "3", name: "Meja Rasson 03", status: "booked", price: 35000, bookedUntil: "Mulai 20:00 WIB", imageUrl: getStorageUrl('tables/rasson-3.jpg') },
    { id: "4", name: "Meja Rasson 04", status: "available", price: 35000, imageUrl: getStorageUrl('tables/rasson-4.jpg') },
    // Biasa Tables (5-8)
    { id: "5", name: "Meja Biasa 01", status: "available", price: 30000, imageUrl: getStorageUrl('tables/biasa-1.webp') },
    { id: "6", name: "Meja Biasa 02", status: "available", price: 30000, imageUrl: getStorageUrl('tables/biasa-2.webp') },
    { id: "7", name: "Meja Biasa 03", status: "occupied", price: 30000, timePlayedStart: new Date(Date.now() - 75 * 60 * 1000).toISOString(), bookedUntil: "22:00 WIB", imageUrl: getStorageUrl('tables/biasa-3.webp') },
    { id: "8", name: "Meja Biasa 04", status: "available", price: 30000, imageUrl: getStorageUrl('tables/biasa-4.webp') },
] as const;

export default function BookingPage() {
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string; price: number } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterMode, setFilterMode] = useState<'all' | 'available'>('all');

    const handleBook = (id: string) => {
        const table = MOCK_TABLES.find(t => t.id === id);
        if (table) {
            setSelectedTable(table);
            setIsModalOpen(true);
        }
    };

    const displayedTables = filterMode === 'all'
        ? MOCK_TABLES
        : MOCK_TABLES.filter(t => t.status === 'available');

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-28 sm:pt-40 pb-20">
            <div className="container mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Booking <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">Meja</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Pilih meja favorit Anda, cek ketersediaan realtime, dan booking langsung.
                    </p>
                </div>

                {/* Pricing Info Alert */}
                <div className="max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start shadow-xl backdrop-blur-sm">
                    <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Info className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <div>
                            <h3 className="font-bold text-white text-lg">Informasi Harga Sewa</h3>
                            <p className="text-sm text-zinc-400">Harga berbeda untuk jam Siang (11.00 - 18.00) dan Malam (18.00 - 02.00).</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                                <span className="text-emerald-400 font-bold block mb-1">Meja Rasson</span>
                                <div className="flex justify-between text-zinc-300"><span>Siang</span> <span>Rp 25.000 /jam</span></div>
                                <div className="flex justify-between text-zinc-300"><span>Malam</span> <span>Rp 35.000 /jam</span></div>
                            </div>
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
                                <span className="text-emerald-400 font-bold block mb-1">Meja Biasa</span>
                                <div className="flex justify-between text-zinc-300"><span>Siang</span> <span>Rp 20.000 /jam</span></div>
                                <div className="flex justify-between text-zinc-300"><span>Malam</span> <span>Rp 30.000 /jam</span></div>
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                            <span className="text-emerald-500 font-bold">PROMO:</span> Paket 3 Jam Rp 50.000 (Hanya Meja Biasa, Jam 11.00 - 18.00)
                        </div>
                    </div>
                </div>

                {/* Enterprise Filter Section */}
                <div className="flex justify-center pt-6 pb-2">
                    <div className="inline-flex p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.5)] relative">
                        {/* Animated background pill could be added here, but active background is simple enough */}
                        <button
                            onClick={() => setFilterMode('all')}
                            className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${filterMode === 'all'
                                ? 'bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-100'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5 scale-95'
                                }`}
                        >
                            Semua Meja
                        </button>
                        <button
                            onClick={() => setFilterMode('available')}
                            className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${filterMode === 'available'
                                ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-100'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5 scale-95'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${filterMode === 'available' ? 'bg-emerald-950 animate-pulse' : 'bg-emerald-500'}`}></span>
                            Tersedia
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8 pb-10">
                    {displayedTables.map((table) => (
                        <TableCard
                            key={table.id}
                            {...table}
                            onBook={(id) => handleBook(id)}
                        />
                    ))}
                </div>

                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    table={selectedTable}
                />
            </div>
        </main>
    );
}
