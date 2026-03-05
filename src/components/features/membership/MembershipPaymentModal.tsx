"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";

interface MembershipPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: string | null;
    price: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
}

export function MembershipPaymentModal({ isOpen, onClose, tier, price, user }: MembershipPaymentModalProps) {
    const [step, setStep] = useState<'payment' | 'payment_proof' | 'success'>('payment');
    const [qrisUrl, setQrisUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            setStep('payment');
            setProofFile(null);
            setProofPreview(null);
            setError(null);
            fetchQris();
        }
    }, [isOpen]);

    const fetchQris = async () => {
        const { data } = await supabase.from('settings').select('qris_image_url').single();
        if (data?.qris_image_url) {
            setQrisUrl(data.qris_image_url);
        }
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            if (step === 'success') {
                // If success and closing, it's done
            }
            onClose();
            setTimeout(() => setStep('payment'), 300);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setProofFile(selectedFile);
            setProofPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handlePaymentSubmit = async () => {
        if (!proofFile || !user || !tier) return;

        setIsLoading(true);
        setError(null);

        try {
            const fileExt = proofFile.name.split('.').pop();
            const fileName = `memberships/proof-${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('web-assets')
                .upload(fileName, proofFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('web-assets')
                .getPublicUrl(fileName);

            // Calculate dates
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            const formattedEndDate = endDate.toISOString().split('T')[0];

            // Insert pending membership
            const { error: insertError } = await supabase
                .from('memberships')
                .insert({
                    user_id: user.id,
                    tier: tier.toLowerCase(),
                    start_date: startDate,
                    end_date: formattedEndDate,
                    status: 'pending',
                    is_active: false,
                    payment_proof_url: publicUrl
                });

            if (insertError) {
                console.error("Insert Error", insertError);
                throw insertError;
            }

            setStep('success');
        } catch (err: unknown) {
            console.error("Payment Confirmation Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Gagal mengkonfirmasi pembayaran.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {step === 'payment' && "Pembayaran Membership"}
                        {step === 'payment_proof' && "Upload Bukti Transfer"}
                        {step === 'success' && "Berhasil!"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {step === 'payment' && `Selesaikan pembayaran untuk tier ${tier}`}
                        {step === 'payment_proof' && "Silakan upload bukti transfer Anda"}
                        {step === 'success' && "Pengajuan membership Anda sedang diproses"}
                    </DialogDescription>
                </DialogHeader>

                {step === 'payment' && (
                    <div className="space-y-6 py-4">
                        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
                            <p className="text-zinc-400 mb-2">Total Pembayaran</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mb-6">
                                {price}
                            </h3>

                            <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                {qrisUrl ? (
                                    <div className="w-48 h-48 bg-transparent flex items-center justify-center overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={qrisUrl} alt="Scan QRIS untuk membayar" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 bg-zinc-200 flex items-center justify-center text-zinc-900 font-bold">
                                        QRIS CODE
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-zinc-500">Scan QRIS di atas untuk membayar</p>
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
                                {price}
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
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            <p className="text-xs text-zinc-500 italic mt-2">
                                * Pastikan foto bukti transfer terlihat jelas dan menampilkan nominal yang sesuai.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setStep('payment')}
                                className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white"
                                disabled={isLoading}
                            >
                                Kembali
                            </Button>
                            <Button
                                onClick={handlePaymentSubmit}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading || !proofFile}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                {isLoading ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-12 flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Pembayaran Diterima</h3>
                        <p className="text-zinc-400">
                            Terima kasih! Bukti transfer untuk <strong>{tier}</strong> telah berhasil diunggah. Admin akan segera memverifikasi pembayaran Anda.
                        </p>
                        <Button
                            onClick={() => handleClose(false)}
                            className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                            Tutup
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
