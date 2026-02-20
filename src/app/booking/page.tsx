"use client";

import { useState } from "react";
import { TableCard } from "@/components/features/tables/TableCard";
import { Info } from "lucide-react";
import { BookingModal } from "@/components/features/booking/BookingModal";


// Mock Data - Adjusted to Night Rates (Standard)
const MOCK_TABLES = [
    // Rasson Tables (1-4)
    { id: "1", name: "Meja Rasson 01", status: "available", price: 35000, imageUrl: "https://images.unsplash.com/photo-1542319770-5b32e2c5aa82?auto=format&fit=crop&q=80&w=800" },
    { id: "2", name: "Meja Rasson 02", status: "occupied", price: 35000, imageUrl: "https://images.unsplash.com/photo-1579782522771-477c7f3f2252?auto=format&fit=crop&q=80&w=800" },
    { id: "3", name: "Meja Rasson 03", status: "booked", price: 35000, imageUrl: "https://images.unsplash.com/photo-1591119567954-5a242c13d783?auto=format&fit=crop&q=80&w=800" },
    { id: "4", name: "Meja Rasson 04", status: "available", price: 35000, imageUrl: "https://images.unsplash.com/photo-1620025974052-a56763568c48?auto=format&fit=crop&q=80&w=800" },
    // Biasa Tables (5-8)
    { id: "5", name: "Meja Biasa 01", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1554350171-8bc42f277ca9?auto=format&fit=crop&q=80&w=800" },
    { id: "6", name: "Meja Biasa 02", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1558273615-585358055c5e?auto=format&fit=crop&q=80&w=800" },
    { id: "7", name: "Meja Biasa 03", status: "occupied", price: 30000, imageUrl: "https://images.unsplash.com/photo-1620025974052-a56763568c48?auto=format&fit=crop&q=80&w=800" },
    { id: "8", name: "Meja Biasa 04", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1542319770-5b32e2c5aa82?auto=format&fit=crop&q=80&w=800" },
] as const;

export default function BookingPage() {
    const [selectedTable, setSelectedTable] = useState<{ id: string; name: string; price: number } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBook = (id: string) => {
        const table = MOCK_TABLES.find(t => t.id === id);
        if (table) {
            setSelectedTable(table);
            setIsModalOpen(true);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-40 pb-20">
            <div className="container mx-auto px-4 space-y-8">
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

                {/* Filter Section (Simple) */}
                <div className="flex justify-center gap-4 pt-4">
                    <button className="px-6 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all text-sm font-medium">
                        Semua Meja
                    </button>
                    <button className="px-6 py-2 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all text-sm font-medium">
                        Status Tersedia
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {MOCK_TABLES.map((table) => (
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
