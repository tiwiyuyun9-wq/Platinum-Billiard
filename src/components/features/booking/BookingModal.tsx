"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { createBooking, confirmPayment } from "@/app/booking/actions";
import { CalendarIcon, Clock, CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: { id: string; name: string; price: number } | null;
}

export function BookingModal({ isOpen, onClose, table }: BookingModalProps) {
    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("19:00");
    const [duration, setDuration] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authOpen, setAuthOpen] = useState(false);

    const [bookingId, setBookingId] = useState<string | null>(null);

    if (!table) return null;

    const isRasson = table.name.toLowerCase().includes('rasson');
    const hourlyRate = isRasson ? 35000 : 30000;
    const estimatedPrice = parseInt(duration) * hourlyRate;

    const handleClose = () => {
        setStep('details');
        setError(null);
        setBookingId(null);
        onClose();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setIsLoading(false);
            toast.error("Silakan Masuk atau Daftar terlebih dahulu untuk melakukan booking.");
            setAuthOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('tableId', table!.id);
        formData.append('tableName', table!.name);
        formData.append('date', date ? format(date, 'yyyy-MM-dd') : '');
        formData.append('time', time);
        formData.append('duration', duration);

        const result = await createBooking(formData);

        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            if (result.booking?.id) {
                setBookingId(result.booking.id);
            }
            // Move to Payment/Success Step
            // For v1, we assume they pay at counter or transfer manually. 
            // Ideally we show QRIS here.
            setStep('payment');
        }
    }

    const handlePaymentSubmit = async () => {
        if (!bookingId) return;

        setIsLoading(true);
        // Here we would upload the file and update booking status
        // For now, just simulate success and update status
        const result = await confirmPayment(bookingId);
        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            setStep('success');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {step === 'details' && `Booking ${table.name}`}
                        {step === 'payment' && "Pembayaran"}
                        {step === 'success' && "Booking Berhasil!"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {step === 'details' && "Pilih jadwal bermain Anda."}
                        {step === 'payment' && "Silakan transfer sesuai nominal di bawah."}
                        {step === 'success' && "Terima kasih! Sampai jumpa di lokasi."}
                    </DialogDescription>
                </DialogHeader>

                {step === 'details' && (
                    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Date Picker */}
                        <div className="grid gap-2">
                            <Label>Tanggal</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-zinc-950 text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Time */}
                            <div className="grid gap-2">
                                <Label>Jam Mulai</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="pl-9 bg-zinc-900 border-zinc-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="grid gap-2">
                                <Label>Durasi</Label>
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                                        <SelectValue placeholder="Pilih durasi" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                                        <SelectItem value="1">1 Jam</SelectItem>
                                        <SelectItem value="2">2 Jam</SelectItem>
                                        <SelectItem value="3">3 Jam</SelectItem>
                                        <SelectItem value="4">4 Jam</SelectItem>
                                        <SelectItem value="5">5 Jam</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Price Estimation */}
                        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
                            <span className="text-sm text-zinc-400">Estimasi Total</span>
                            <span className="text-xl font-bold text-emerald-400">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(estimatedPrice)}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                {isLoading ? "Memproses..." : "Konfirmasi Booking"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === 'payment' && (
                    <div className="space-y-6 py-4">
                        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
                            <p className="text-zinc-400 mb-2">Total Pembayaran</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mb-6">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(estimatedPrice)}
                            </h3>

                            <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                {/* Placeholder QRIS */}
                                <div className="w-48 h-48 bg-zinc-200 flex items-center justify-center text-zinc-900 font-bold">
                                    QRIS CODE
                                </div>
                            </div>
                            <p className="text-sm text-zinc-500">Scan QRIS di atas untuk membayar</p>
                            <p className="text-xs text-zinc-600 mt-1">BCA a.n Billiard Enterprise<br />123 456 7890</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload Bukti Transfer (Opsional)</Label>
                            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                <p className="text-xs text-zinc-400">Klik untuk upload foto bukti pembayaran</p>
                            </div>
                        </div>

                        <Button onClick={handlePaymentSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Saya Sudah Bayar
                        </Button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Booking Terkirim!</h3>
                        <p className="text-zinc-400">
                            Kami sedang memverifikasi pembayaran Anda. Status booking dapat dilihat di dashboard.
                        </p>
                        <Button onClick={handleClose} variant="outline" className="mt-6 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                            Tutup
                        </Button>
                    </div>
                )}
            </DialogContent>

            <AuthModal
                open={authOpen}
                onOpenChange={setAuthOpen}
                defaultMode="login"
            />
        </Dialog>
    );
}
