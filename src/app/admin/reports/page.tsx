"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, subDays, isSameDay, getHours } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
    const supabase = createClient();
    const [revenueData, setRevenueData] = useState<{ name: string; total: number }[]>([]);
    const [peakHoursData, setPeakHoursData] = useState<{ hour: string; visitors: number }[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchReports = async () => {
            const { data } = await supabase
                .from("bookings")
                .select("start_time, total_price")
                .in("status", ["confirmed", "completed"]);

            if (data && data.length > 0) {
                // Total Revenue
                const total = data.reduce((acc, curr) => acc + Number(curr.total_price), 0);
                setTotalRevenue(total);

                // Revenue Data (Last 7 Days)
                const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
                const chartData = last7Days.map(date => {
                    const dailyBookings = data.filter(b => isSameDay(new Date(b.start_time), date));
                    const dailyTotal = dailyBookings.reduce((acc, curr) => acc + Number(curr.total_price), 0);
                    return {
                        name: format(date, "eee"),
                        total: dailyTotal
                    };
                });
                setRevenueData(chartData);

                // Peak Hours Data
                const hoursCount: Record<string, number> = {};
                // Initialize common active hours
                for (let i = 10; i <= 23; i++) hoursCount[`${i}:00`] = 0;

                data.forEach(b => {
                    const hr = getHours(new Date(b.start_time));
                    const key = `${hr.toString().padStart(2, '0')}:00`;
                    if (hoursCount[key] !== undefined) {
                        hoursCount[key] += 1; // Assuming 1 booking = 1 group of visitors
                    } else {
                        hoursCount[key] = 1;
                    }
                });

                const peakData = Object.keys(hoursCount).sort().map(k => ({
                    hour: k,
                    visitors: hoursCount[k] * 2 // Estimate 2 visitors per booking
                }));
                setPeakHoursData(peakData);
            } else {
                // Empty state initialization
                const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
                setRevenueData(last7Days.map(date => ({ name: format(date, "eee"), total: 0 })));
                const defaultHours = [];
                for (let i = 10; i <= 23; i += 2) defaultHours.push({ hour: `${i}:00`, visitors: 0 });
                setPeakHoursData(defaultHours);
            }
        };
        fetchReports();
    }, [supabase]);

    const formattedTotal = totalRevenue > 1000000
        ? `Rp ${(totalRevenue / 1000000).toFixed(1)}M`
        : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalRevenue);

    const ratarata = totalRevenue / 7;
    const formattedAverage = ratarata > 1000000
        ? `Rp ${(ratarata / 1000000).toFixed(1)}M`
        : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(ratarata); return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Laporan Operasional</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Periode:</span>
                        <Input type="date" className="w-[150px] bg-zinc-900 border-zinc-800 text-white" />
                    </div>
                </div>

                <Tabs defaultValue="revenue" className="space-y-6">
                    <TabsList className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 text-zinc-400 p-1.5 rounded-2xl h-auto">
                        <TabsTrigger value="revenue" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:shadow-lg transition-all font-medium">Pendapatan</TabsTrigger>
                        <TabsTrigger value="traffic" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:shadow-lg transition-all font-medium">Traffic & Peak Hours</TabsTrigger>
                        <TabsTrigger value="tables" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 data-[state=active]:shadow-lg transition-all font-medium">Performa Meja</TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-6 mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl group hover:border-emerald-500/50 transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Pendapatan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-extrabold text-white">{formattedTotal}</div>
                                    <p className="text-xs text-emerald-400 font-bold mt-1">Estimasi berjalan</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl group hover:border-emerald-500/50 transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Rata-rata Harian</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-extrabold text-white">{formattedAverage}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden mt-6">
                            <CardHeader className="border-b border-white/5 bg-white/5">
                                <CardTitle className="text-white text-xl">Tren Pendapatan Mingguan</CardTitle>
                                <CardDescription className="text-zinc-400">Grafik pendapatan kotor per hari.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => value > 1000000 ? `Rp${(value / 1000000).toFixed(1)}M` : value.toString()}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                            formatter={(value: number | undefined) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)}
                                        />
                                        <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="traffic" className="space-y-6 mt-6">
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/5">
                                <CardTitle className="text-white text-xl">Peak Hours (Jam Ramai)</CardTitle>
                                <CardDescription className="text-zinc-400">Rata-rata pengunjung berdasarkan jam operasional.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={peakHoursData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="hour"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#a1a1aa' }}
                                            formatter={(value: number | undefined) => [value, "Pengunjung"]}
                                        />
                                        <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 6, fill: '#60a5fa' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tables" className="space-y-4">
                        <div className="text-zinc-500 text-center py-20">
                            Data performa meja akan muncul setelah ada data booking yang cukup.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        );
}
