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

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: { id: string; name: string; price: number } | null;
}

export function BookingModal({ isOpen, onClose, table }: BookingModalProps) {
    const [step, setStep] = useState<'details' | 'payment' | 'payment_proof' | 'success'>('details');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("19:00");
    const [duration, setDuration] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [bookingId, setBookingId] = useState<string | null>(null);
    const [qrisUrl, setQrisUrl] = useState<string | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const supabase = createClient();

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
            // Fetch dynamic QRIS URL
            const { data } = await supabase
                .from("settings")
                .select("qris_image_url")
                .eq("id", 1)
                .single();
            if (data?.qris_image_url) {
                setQrisUrl(data.qris_image_url);
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setProofFile(selectedFile);
            setProofPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handlePaymentSubmit = async () => {
        if (!bookingId || !proofFile) return;

        setIsLoading(true);
        setError(null);

        try {
            const fileExt = proofFile.name.split('.').pop();
            const fileName = `proof-${bookingId}-${Date.now()}.${fileExt}`;
            const filePath = `payment-proofs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('web-assets')
                .upload(filePath, proofFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('web-assets')
                .getPublicUrl(filePath);

            const result = await confirmPayment(bookingId, publicUrl);

            if (result?.error) {
                setError(result.error);
            } else {
                setStep('success');
            }
        } catch (err: any) {
            console.error("Payment Confirmation Error:", err);
            setError(err.message || "Gagal mengkonfirmasi pembayaran.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {step === 'details' && `Booking ${table.name}`}
                        {step === 'payment' && "Pembayaran"}
                        {step === 'payment_proof' && "Upload Bukti Transfer"}
                        {step === 'success' && "Booking Berhasil!"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {step === 'details' && "Pilih jadwal bermain Anda."}
                        {step === 'payment' && "Silakan transfer sesuai nominal di bawah."}
                        {step === 'payment_proof' && "Upload foto persetujuan transfer Anda."}
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
                                {/* Dynamic QRIS */}
                                {qrisUrl ? (
                                    <div className="w-48 h-48 bg-transparent flex items-center justify-center overflow-hidden">
                                        <img src={qrisUrl} alt="Scan QRIS untuk membayar" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 bg-zinc-200 flex items-center justify-center text-zinc-900 font-bold">
                                        QRIS CODE
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-zinc-500">Scan QRIS di atas untuk membayar</p>
                            <p className="text-xs text-zinc-600 mt-1">Sistem Otomatis Billiard Enterprise</p>
                        </div>

                        <Button
                            onClick={() => setStep('payment_proof')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            Lanjut Upload Bukti
                        </Button>
                    </div>
                )}

                {step === 'payment_proof' && (
                    <div className="space-y-6 py-4">
                        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
                            <p className="text-zinc-400 mb-2">Total Pembayaran</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mb-2">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(estimatedPrice)}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload Bukti Transfer <span className="text-red-500">*</span></Label>
                            {error && (
                                <div className="text-red-500 text-xs mb-2">{error}</div>
                            )}
                            <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                {proofPreview ? (
                                    <div className="flex flex-col items-center">
                                        <img src={proofPreview} alt="Bukti Transfer" className="h-24 w-auto rounded-md object-contain mb-2" />
                                        <p className="text-xs text-emerald-500 font-medium">Bukti berhasil dipilih, klik untuk mengubah</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                        <p className="text-xs text-zinc-400">Klik untuk upload foto bukti pembayaran</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setStep('payment')}
                                variant="outline"
                                className="w-1/3 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                            >
                                Kembali
                            </Button>
                            <Button
                                onClick={handlePaymentSubmit}
                                disabled={!proofFile || isLoading}
                                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </Button>
                        </div>
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
        </Dialog>
    );
}
