"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Booking {
    id: string;
    table_id: string;
    start_time: string;
    end_time: string;
    total_price: number;
    status: string;
    payment_proof_url: string | null;
    user_id: string;
    profiles?: { full_name: string; email: string };
    tables?: { name: string };
}

export default function PaymentVerificationPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const fetchPendingBookings = async () => {
        const { data, error } = await supabase
            .from("bookings")
            .select(`
                *,
                tables (name)
            `)
            .eq("status", "waiting_confirmation")
            .order("created_at", { ascending: true });

        if (error) {
            console.error(error);
            toast.error("Gagal memuat data booking");
        } else {
            // Fetch user profiles separately if needed or via join if relation exists
            // Assuming bookings has user_id, we can fetch profiles
            const userIds = data.map(b => b.user_id);
            const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);

            const bookingsWithProfile = data.map(b => ({
                ...b,
                profiles: profiles?.find(p => p.id === b.user_id)
            }));

            setBookings(bookingsWithProfile as Booking[]);
        }
        setIsLoading(false);
    };

    const handleAction = async (bookingId: string, action: "approve" | "reject") => {
        const newStatus = action === "approve" ? "confirmed" : "rejected";
        const toastId = toast.loading("Memproses...");

        const { error } = await supabase
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", bookingId);

        toast.dismiss(toastId);

        if (error) {
            toast.error(`Gagal ${action} booking`);
            return;
        }

        toast.success(`Booking berhasil di-${action}`);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Verifikasi Pembayaran</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500">Tidak ada pembayaran yang perlu diverifikasi saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="bg-zinc-900 border-zinc-800 flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white">{booking.profiles?.full_name || "Guest"}</h3>
                                        <p className="text-xs text-zinc-500">{booking.profiles?.email}</p>
                                    </div>
                                    <Badge variant="outline" className="text-amber-400 border-amber-500/50 bg-amber-500/10">
                                        Perlu Cek
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-zinc-500">Meja</div>
                                    <div className="text-white font-medium text-right">{booking.tables?.name}</div>

                                    <div className="text-zinc-500">Tanggal</div>
                                    <div className="text-white font-medium text-right">
                                        {format(new Date(booking.start_time), "dd MMM yyyy")}
                                    </div>

                                    <div className="text-zinc-500">Jam</div>
                                    <div className="text-white font-medium text-right">
                                        {format(new Date(booking.start_time), "HH:mm")} - {format(new Date(booking.end_time), "HH:mm")}
                                    </div>

                                    <div className="text-zinc-500">Total</div>
                                    <div className="text-emerald-400 font-bold text-right">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(booking.total_price)}
                                    </div>
                                </div>

                                {/* Proof Image Thumbnail */}
                                {booking.payment_proof_url ? (
                                    <div className="mt-4">
                                        <p className="text-xs text-zinc-500 mb-2">Bukti Transfer:</p>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="relative h-32 w-full rounded-lg overflow-hidden border border-zinc-700 cursor-pointer group hover:border-emerald-500 transition-colors">
                                                    <Image
                                                        src={booking.payment_proof_url}
                                                        alt="Bukti Transfer"
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Eye className="text-white w-6 h-6" />
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-950 border-zinc-800 max-w-3xl">
                                                <div className="relative w-full aspect-video">
                                                    <Image
                                                        src={booking.payment_proof_url}
                                                        alt="Bukti Transfer Full"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-center">
                                        <p className="text-red-400 text-xs">Tidak ada bukti upload</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400"
                                    onClick={() => handleAction(booking.id, "reject")}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Tolak
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                    onClick={() => handleAction(booking.id, "approve")}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Terima
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
