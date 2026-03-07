import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Coins, History } from "lucide-react";
import { PointsInfoModal } from "@/components/features/rewards/PointsInfoModal";
import Image from "next/image";

// Mock Rewards Catalog
const REWARDS_CATALOG = [
    {
        id: "1",
        title: "Free Soft Drink",
        points: 50,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
        description: "Tukarkan 50 poin untuk 1 soft drink apa saja.",
    },
    {
        id: "2",
        title: "Diskon Sewa Rp 20rb",
        points: 150,
        image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=400",
        description: "Potongan harga langsung untuk sewa meja.",
    },
    {
        id: "3",
        title: "1 Jam Main Gratis",
        points: 300,
        image: "https://images.unsplash.com/photo-1579782522771-477c7f3f2252?auto=format&fit=crop&q=80&w=400",
        description: "Main gratis selama 1 jam di meja Regular.",
    },
    {
        id: "4",
        title: "Kaos Eksklusif Platinum",
        points: 1000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400",
        description: "Merchandise resmi Platinum Billiard.",
    },
];

export default async function RewardsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    // Fetch User Points
    const { data: userPoints } = await supabase
        .from("user_points")
        .select("current_points")
        .eq("user_id", user.id)
        .single();

    const currentPoints = userPoints?.current_points || 0;

    // Fetch Point History
    const { data: history } = await supabase
        .from("point_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    // Fetch Earning Methods
    const { data: earningMethods } = await supabase
        .from("point_earning_methods")
        .select("*")
        .order("created_at", { ascending: true });

    return (
        <div className="min-h-screen bg-zinc-950 pt-40 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Poin & Rewards</h1>
                        <p className="text-zinc-400">Kumpulkan poin dari setiap booking dan tukarkan dengan hadiah menarik.</p>
                    </div>
                </div>

                {/* Points Hero Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 shadow-2xl mb-12">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-amber-100 font-medium mb-1">Total Poin Anda</p>
                            <h2 className="text-6xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                <Coins className="w-12 h-12 text-amber-200" />
                                {currentPoints.toLocaleString('id-ID')}
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <PointsInfoModal methods={earningMethods || []} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Catalog Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-xl font-bold text-white">Katalog Reward</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {REWARDS_CATALOG.map((item) => (
                                <Card key={item.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all group">
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            unoptimized
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-amber-400 flex items-center gap-1">
                                            <Coins className="w-3 h-3" />
                                            {item.points} Poin
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{item.description}</p>
                                        <Button
                                            size="sm"
                                            className="w-full bg-zinc-800 hover:bg-emerald-600 text-white border border-zinc-700 hover:border-emerald-500 transition-all"
                                            disabled={currentPoints < item.points}
                                        >
                                            {currentPoints < item.points ? "Poin Belum Cukup" : "Tukar Reward"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold text-white">Riwayat Poin</h2>
                        </div>

                        <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 space-y-4">
                            {history && history.length > 0 ? (
                                history.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.description}</p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <span className={`font-bold text-sm ${item.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {item.amount > 0 ? '+' : ''}{item.amount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-zinc-500 text-sm">
                                    Belum ada riwayat poin.
                                </div>
                            )}

                            {/* Dummy History for Visualization if Empty */}
                            {(!history || history.length === 0) && (
                                <>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 opacity-50">
                                        <div>
                                            <p className="text-sm font-medium text-white">Booking Meja #1</p>
                                            <p className="text-xs text-zinc-500">12 Feb</p>
                                        </div>
                                        <span className="font-bold text-sm text-emerald-400">+50</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 opacity-50">
                                        <div>
                                            <p className="text-sm font-medium text-white">Tukar Voucher</p>
                                            <p className="text-xs text-zinc-500">10 Feb</p>
                                        </div>
                                        <span className="font-bold text-sm text-red-400">-100</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
