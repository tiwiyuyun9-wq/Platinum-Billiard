"use client";

import { useState, useEffect } from "react";
import { TableCard } from "@/components/features/tables/TableCard";
import { Info, Loader2 } from "lucide-react";
import { BookingModal } from "@/components/features/booking/BookingModal";
import { getStorageUrl } from "@/utils/supabase/storage";
import { createClient } from "@/utils/supabase/client";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface TableData {
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    imageUrl?: string;
}

export default function BookingPage() {
    const [tables, setTables] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterMode, setFilterMode] = useState<'all' | 'available'>('all');
    const [user, setUser] = useState<User | null>(null);
    const [authOpen, setAuthOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        const fetchTables = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from('tables').select('*').order('name');
            if (error) {
                console.error("Error fetching tables:", error);
                toast.error("Gagal memuat daftar meja.");
            } else if (data) {
                // Determine price and image based on type for display
                const formattedTables = data.map(t => ({
                    ...t,
                    price: t.type === 'rasson' ? 35000 : 30000,
                    imageUrl: getStorageUrl(`tables/${t.type === 'rasson' ? 'rasson-1.jpg' : 'biasa-1.webp'}`)
                }));
                setTables(formattedTables);
            }
            setIsLoading(false);
        };
        fetchTables();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleBook = (id: string) => {
        if (!user) {
            toast.error("Silakan Masuk atau Daftar terlebih dahulu untuk melakukan booking.");
            setAuthOpen(true);
            return;
        }
        const table = tables.find(t => t.id === id);
        if (table) {
            setSelectedTable(table);
            setIsModalOpen(true);
        }
    };

    const displayedTables = filterMode === 'all'
        ? tables
        : tables.filter(t => t.status === 'available');

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

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8 pb-10">
                        {displayedTables.map((table) => (
                            <TableCard
                                key={table.id}
                                id={table.id}
                                name={table.name}
                                status={table.status as any}
                                price={table.price}
                                imageUrl={table.imageUrl || ''}
                                timePlayedStart={table.status === 'occupied' ? new Date().toISOString() : undefined}
                                bookedUntil={table.status === 'booked' ? "20:00 WIB" : undefined}
                                onBook={(id) => handleBook(id)}
                            />
                        ))}
                    </div>
                )}

                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    table={selectedTable}
                />

                <AuthModal
                    open={authOpen}
                    onOpenChange={setAuthOpen}
                    defaultMode="login"
                />
            </div>
        </main>
    );
}
