"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, Upload, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { confirmPayment } from "@/app/booking/actions";
import { cancelBooking } from "@/app/profile/actions";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BookingDetailsModal({ isOpen, onClose, booking, qrisUrl }: { isOpen: boolean, onClose: () => void, booking: any, qrisUrl: string | null }) {
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    if (!booking) return null;

    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error("Hanya file gambar yang diperbolehkan.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 5MB.");
                return;
            }
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const handlePaymentSubmit = async () => {
        if (!proofFile) {
            toast.error("Silakan upload bukti transfer terlebih dahulu.");
            return;
        }

        setIsSubmitting(true);
        try {
            const fileExt = proofFile.name.split('.').pop();
            const fileName = `proof-${booking.id}-${Date.now()}.${fileExt}`;
            const filePath = `payment-proofs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('web-assets')
                .upload(filePath, proofFile);

            if (uploadError) throw new Error("Gagal mengunggah bukti transfer.");

            const { data: { publicUrl } } = supabase.storage
                .from('web-assets')
                .getPublicUrl(filePath);

            const result = await confirmPayment(booking.id, publicUrl);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Bukti transfer berhasil diunggah! Menunggu konfirmasi admin.");
                onClose();
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setShowCancelConfirm(true);
    };

    const confirmCancel = async () => {
        setIsCancelling(true);
        try {
            const result = await cancelBooking(booking.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Booking berhasil dibatalkan.");
                setShowCancelConfirm(false);
                onClose();
            }
        } catch {
            toast.error("Gagal membatalkan booking.");
        } finally {
            setIsCancelling(false);
        }
    };

    const closeModal = () => {
        setShowCancelConfirm(false);
        onClose();
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending_payment': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle, label: 'MENUNGGU PEMBAYARAN' };
            case 'waiting_confirmation': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock, label: 'MENUNGGU KONFIRMASI' };
            case 'confirmed': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'DIKONFIRMASI' };
            case 'completed': return { color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700', icon: CheckCircle2, label: 'SELESAI' };
            case 'cancelled': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, label: 'DIBATALKAN' };
            case 'rejected': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, label: 'DITOLAK' };
            default: return { color: 'text-white', bg: 'bg-zinc-800', border: 'border-zinc-700', icon: Clock, label: status.toUpperCase().replace('_', ' ') };
        }
    };

    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const copyRekening = () => {
        navigator.clipboard.writeText("1234567890");
        toast.success("Nomor rekening disalin!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto p-0">
                {showCancelConfirm ? (
                    <div className="p-6 space-y-6">
                        <div className="text-center space-y-4 pt-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Batalkan Booking?</h3>
                                <p className="text-zinc-400 mt-2 text-sm">
                                    Apakah Anda yakin ingin membatalkan booking untuk <strong className="text-white">{booking.tables?.name || `Meja ${booking.table_id}`}</strong>? Tindakan ini tidak dapat diurungkan.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelConfirm(false)}
                                disabled={isCancelling}
                                className="w-full sm:w-1/2 border-zinc-700 text-zinc-300"
                            >
                                Kembali
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmCancel}
                                disabled={isCancelling}
                                className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Ya, Batalkan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                            <DialogTitle className="text-xl font-bold flex items-center justify-between">
                                Detail Booking
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {statusConfig.label}
                                </div>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                ID: <span className="font-mono text-zinc-300">{booking.id.split('-')[0]}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-6 space-y-6">
                            {/* Booking Info Card */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-zinc-500">Meja</p>
                                        <p className="text-lg font-bold text-white">{booking.tables?.name || `Meja ${booking.table_id}`}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-500">Total Tagihan</p>
                                        <p className="text-xl font-bold text-emerald-400">{formatRupiah(booking.total_price)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                    <div>
                                        <p className="text-sm text-zinc-500 flex items-center gap-1.5 mb-1"><Calendar className="w-4 h-4" /> Tanggal</p>
                                        <p className="font-medium">{format(new Date(booking.start_time), "dd MMMM yyyy", { locale: id })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 flex items-center gap-1.5 mb-1"><Clock className="w-4 h-4" /> Waktu</p>
                                        <p className="font-medium">
                                            {format(new Date(booking.start_time), "HH:mm")} - {format(new Date(booking.end_time), "HH:mm")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area based on status */}
                            {booking.status === 'pending_payment' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200/80 text-sm">
                                        <p className="font-medium text-amber-500 mb-1 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Selesaikan Pembayaran
                                        </p>
                                        Waktu Anda untuk membayar akan habis dalam 15 menit. Booking akan otomatis dibatalkan jika melewati batas waktu.
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-white mb-3">1. Transfer Manual</h4>
                                            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center group">
                                                <div>
                                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">BCA</p>
                                                    <p className="font-mono text-lg text-emerald-400 font-bold tracking-wide">1234567890</p>
                                                    <p className="text-xs text-zinc-400 mt-0.5">a.n Billiard Enterprise</p>
                                                </div>
                                                <button
                                                    onClick={copyRekening}
                                                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all active:scale-95"
                                                >
                                                    <Copy className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {qrisUrl && (
                                            <div className="pt-4 border-t border-zinc-800">
                                                <h4 className="text-sm font-medium text-white mb-3">2. Atau scan QRIS</h4>
                                                <div className="bg-white p-4 rounded-xl flex justify-center mx-auto max-w-[200px]">
                                                    <Image src={qrisUrl} alt="QRIS" width={200} height={200} className="w-full h-auto" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Proof */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-white">Upload Bukti Transfer *</h4>
                                        <label className={`
                                    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer
                                    transition-colors
                                    ${proofPreview ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-500'}
                                `}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {proofPreview ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 relative rounded overflow-hidden">
                                                            <Image src={proofPreview} alt="Preview" fill className="object-cover" />
                                                        </div>
                                                        <span className="text-sm text-emerald-500 font-medium">Foto siap diunggah</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-3 text-zinc-500" />
                                                        <p className="mb-1 text-sm text-zinc-400"><span className="font-semibold text-white">Klik untuk upload</span></p>
                                                        <p className="text-xs text-zinc-500">PNG, JPG (Max. 5MB)</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* View Proof if waiting confirmation */}
                            {booking.status === 'waiting_confirmation' && booking.payment_proof_url && (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-zinc-400 mb-3">Bukti Transfer Anda</h4>
                                    <div className="relative aspect-auto max-h-[300px] w-full rounded-lg overflow-hidden border border-zinc-800">
                                        <img src={booking.payment_proof_url} alt="Payment Proof" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row gap-3 justify-end">
                            {booking.status === 'pending_payment' ? (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={handleCancel}
                                        disabled={isCancelling || isSubmitting}
                                        className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                    >
                                        {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Batalkan Booking
                                    </Button>
                                    <Button
                                        onClick={handlePaymentSubmit}
                                        disabled={isSubmitting || !proofFile}
                                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Kirim Bukti Transfer"}
                                    </Button>
                                </>
                            ) : booking.status === 'waiting_confirmation' ? (
                                <Button
                                    variant="destructive"
                                    onClick={handleCancel}
                                    disabled={isCancelling}
                                    className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                >
                                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Batalkan Booking
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={closeModal}
                                    className="w-full sm:w-auto border-zinc-700 text-zinc-300"
                                >
                                    Tutup
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
