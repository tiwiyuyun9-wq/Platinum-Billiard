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
                <TabsList className="bg-zinc-900 border-zinc-800 text-zinc-400">
                    <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
                    <TabsTrigger value="traffic">Traffic & Peak Hours</TabsTrigger>
                    <TabsTrigger value="tables">Performa Meja</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Total Pendapatan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">Rp 49.200.000</div>
                                <p className="text-xs text-emerald-500">+12% dari minggu lalu</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Rata-rata Harian</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">Rp 7.028.571</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Tren Pendapatan Mingguan</CardTitle>
                            <CardDescription>Grafik pendapatan kotor per hari.</CardDescription>
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

                <TabsContent value="traffic" className="space-y-4">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Peak Hours (Jam Ramai)</CardTitle>
                            <CardDescription>Rata-rata pengunjung berdasarkan jam operasional.</CardDescription>
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
