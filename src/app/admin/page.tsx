import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch Stats (Mockable for now, real implementation later)
    const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });
    const { count: membersCount } = await supabase.from("memberships").select("*", { count: "exact", head: true });

    // Calculate Revenue logic would go here

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Dashboard <span className="text-emerald-500">Overview</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-light">Pantau performa bisnis Anda secara real-time.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden relative group hover:border-white/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <DollarSign className="w-24 h-24 text-emerald-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Total Revenue</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold text-white tracking-tight">Rp 45.2M</div>
                        <p className="text-xs text-emerald-400 font-medium mt-1">+20.1% <span className="text-zinc-500 font-normal">dari bulan lalu</span></p>
                    </CardContent>
                </Card>

                {/* Booking Card */}
                <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden relative group hover:border-white/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <Activity className="w-24 h-24 text-blue-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Booking Aktif</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold text-white tracking-tight">{bookingsCount || 12}</div>
                        <p className="text-xs text-blue-400 font-medium mt-1">Hari ini <span className="text-zinc-500 font-normal">sedang berjalan</span></p>
                    </CardContent>
                </Card>

                {/* Members Card */}
                <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden relative group hover:border-white/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <Users className="w-24 h-24 text-amber-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Member Baru</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold text-white tracking-tight">+{membersCount || 24}</div>
                        <p className="text-xs text-amber-400 font-medium mt-1">+10 <span className="text-zinc-500 font-normal">sejak minggu lalu</span></p>
                    </CardContent>
                </Card>

                {/* Verification Card */}
                <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden relative group hover:border-white/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <CreditCard className="w-24 h-24 text-red-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Verifikasi Pending</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-red-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold text-red-400 tracking-tight">3</div>
                        <p className="text-xs text-red-400 font-medium mt-1">Perlu tindakan segera</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4 bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">Overview Pendapatan</CardTitle>
                        <p className="text-sm text-zinc-400">Tren pendapatan 7 hari terakhir.</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center text-zinc-600 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20">
                            (Chart Data Loading...)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-3 bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">Recent Booking</CardTitle>
                        <p className="text-sm text-zinc-400">5 transaksi terakhir hari ini.</p>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            {[
                                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+ Rp 350.000", init: "OM", color: "bg-blue-500" },
                                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+ Rp 150.000", init: "JL", color: "bg-emerald-500" },
                                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+ Rp 450.000", init: "IN", color: "bg-amber-500" },
                                { name: "William Kim", email: "will@email.com", amount: "+ Rp 200.000", init: "WK", color: "bg-purple-500" },
                                { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+ Rp 250.000", init: "SD", color: "bg-rose-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center group">
                                    <div className={`w-10 h-10 rounded-full ${item.color}/20 flex items-center justify-center text-${item.color.split('-')[1]}-400 font-bold text-sm ring-1 ring-white/5`}>
                                        {item.init}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-semibold leading-none text-white group-hover:text-emerald-400 transition-colors">{item.name}</p>
                                        <p className="text-xs text-zinc-500">{item.email}</p>
                                    </div>
                                    <div className="ml-auto font-bold text-white text-sm">
                                        {item.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
