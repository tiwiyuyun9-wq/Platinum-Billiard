"use client";

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

const MOCK_REVENUE_DATA = [
    { name: "Mon", total: 4500000 },
    { name: "Tue", total: 3200000 },
    { name: "Wed", total: 5800000 },
    { name: "Thu", total: 4100000 },
    { name: "Fri", total: 8900000 },
    { name: "Sat", total: 12500000 },
    { name: "Sun", total: 10200000 },
];

const MOCK_PEAK_HOURS = [
    { hour: "10:00", visitors: 5 },
    { hour: "12:00", visitors: 15 },
    { hour: "14:00", visitors: 10 },
    { hour: "16:00", visitors: 25 },
    { hour: "18:00", visitors: 45 },
    { hour: "20:00", visitors: 60 },
    { hour: "22:00", visitors: 55 },
    { hour: "00:00", visitors: 30 },
];

export default function ReportsPage() {

    return (
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
                                <div className="text-3xl font-extrabold text-white">Rp 49.2M</div>
                                <p className="text-xs text-emerald-400 font-bold mt-1">+12% <span className="text-zinc-500 font-normal">dari minggu lalu</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl group hover:border-emerald-500/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Rata-rata Harian</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold text-white">Rp 7.0M</div>
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
                                <BarChart data={MOCK_REVENUE_DATA}>
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
                                        tickFormatter={(value) => `Rp${value / 1000000}M`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
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
                                <LineChart data={MOCK_PEAK_HOURS}>
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
                                    />
                                    <Line type="monotone" dataKey="visitors" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
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
