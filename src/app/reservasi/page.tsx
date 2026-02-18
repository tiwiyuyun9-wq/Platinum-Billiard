"use client";

import { TableCard } from "@/components/features/tables/TableCard";

// Mock Data for MVP - 8 Tables @ 30k
const MOCK_TABLES = [
    { id: "1", name: "Meja 01", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1542319770-5b32e2c5aa82?auto=format&fit=crop&q=80&w=800" },
    { id: "2", name: "Meja 02", status: "occupied", price: 30000, imageUrl: "https://images.unsplash.com/photo-1579782522771-477c7f3f2252?auto=format&fit=crop&q=80&w=800" },
    { id: "3", name: "Meja 03", status: "booked", price: 30000, imageUrl: "https://images.unsplash.com/photo-1591119567954-5a242c13d783?auto=format&fit=crop&q=80&w=800" },
    { id: "4", name: "Meja 04", status: "maintenance", price: 30000, imageUrl: "https://images.unsplash.com/photo-1620025974052-a56763568c48?auto=format&fit=crop&q=80&w=800" },
    { id: "5", name: "Meja 05", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1554350171-8bc42f277ca9?auto=format&fit=crop&q=80&w=800" },
    { id: "6", name: "Meja 06", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1558273615-585358055c5e?auto=format&fit=crop&q=80&w=800" },
    { id: "7", name: "Meja 07", status: "occupied", price: 30000, imageUrl: "https://images.unsplash.com/photo-1620025974052-a56763568c48?auto=format&fit=crop&q=80&w=800" },
    { id: "8", name: "Meja 08", status: "available", price: 30000, imageUrl: "https://images.unsplash.com/photo-1542319770-5b32e2c5aa82?auto=format&fit=crop&q=80&w=800" },
] as const;

export default function ReservationPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-20">
            <div className="container mx-auto px-4 space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Reservasi <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">Meja</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Pilih meja favorit Anda, cek ketersediaan realtime, dan booking langsung tanpa antri.
                    </p>
                </div>

                {/* Filter Section (Simple) */}
                <div className="flex justify-center gap-4">
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
                            onBook={(id) => console.log("Book table", id)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
