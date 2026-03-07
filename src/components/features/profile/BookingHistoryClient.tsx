"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BookingDetailsModal } from "./BookingDetailsModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BookingHistoryClient({ bookings, qrisUrl }: { bookings: any[], qrisUrl: string | null }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    const getLocalizedStatus = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'MENUNGGU PEMBAYARAN';
            case 'waiting_confirmation': return 'MENUNGGU KONFIRMASI';
            case 'confirmed': return 'DIKONFIRMASI';
            case 'completed': return 'SELESAI';
            case 'cancelled': return 'DIBATALKAN';
            case 'rejected': return 'DITOLAK';
            default: return status.toUpperCase().replace('_', ' ');
        }
    };

    return (
        <div className="grid gap-4">
            {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                    <Card
                        key={booking.id}
                        className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer overflow-hidden group"
                        onClick={() => setSelectedBooking(booking)}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6 relative">
                            {/* Date Box */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-zinc-950/80 rounded-xl w-16 h-16 border border-zinc-800 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                                <span className="text-xs text-zinc-500 uppercase font-bold">DATE</span>
                                <span className="text-xl font-bold text-white">
                                    {new Date(booking.start_time).getDate()}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="flex-grow space-y-1">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {booking.tables?.name || `Meja ${booking.table_id}`}
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${booking.status === 'confirmed' ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" :
                                        booking.status === 'pending_payment' ? "bg-amber-950/30 text-amber-400 border-amber-900/50 animate-pulse" :
                                            booking.status === 'waiting_confirmation' ? "bg-blue-950/30 text-blue-400 border-blue-900/50" :
                                                booking.status === 'completed' ? "bg-zinc-800 text-zinc-300 border-zinc-700" :
                                                    "bg-red-950/30 text-red-400 border-red-900/50"
                                        }`}>
                                        {getLocalizedStatus(booking.status)}
                                    </span>
                                </h3>
                                <div className="flex items-center text-zinc-400 text-sm gap-4">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1.5 hidden sm:flex">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(booking.start_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-lg font-bold text-emerald-400">
                                    Rp {booking.total_price?.toLocaleString('id-ID')}
                                </span>
                                {booking.status === 'pending_payment' ? (
                                    <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-900/20">
                                        Bayar Sekarang
                                    </Button>
                                ) : (
                                    <span className="text-xs text-zinc-500 flex items-center group-hover:text-emerald-400 transition-colors">
                                        Lihat Detail <ChevronRight className="w-3 h-3 ml-1" />
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <Calendar className="w-8 h-8 text-zinc-600" />
                    </div>
                    <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl space-y-3">
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                            Anda belum pernah melakukan booking meja. Yuk, booking meja sekarang dan nikmati permainannya!
                        </p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                            <Link href="/booking">Booking Meja</Link>
                        </Button>
                    </div>
                </div>
            )}

            <BookingDetailsModal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                booking={selectedBooking}
                qrisUrl={qrisUrl}
            />
        </div>
    );
}
