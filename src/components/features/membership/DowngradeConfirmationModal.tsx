"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { downgradeToStandard } from "@/app/membership/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DowngradeConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DowngradeConfirmationModal({ isOpen, onClose }: DowngradeConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDowngrade = async () => {
        setIsLoading(true);
        try {
            const result = await downgradeToStandard();
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Berhasil downgrade ke tier Standard.");
                router.refresh(); // Refresh page to reflect new status
                onClose();
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem saat memproses downgrade.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader className="flex flex-col items-center justify-center pt-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white text-center">
                        Downgrade ke Standard?
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-center leading-relaxed mt-2">
                        Anda akan kembali ke tier <strong className="text-white">Standard</strong> (Gratis).<br />
                        Semua benefit eksklusif dari tier premium Anda saat ini akan dihentikan seketika.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-3 pt-6 w-full">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white"
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDowngrade}
                        variant="destructive"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {isLoading ? "Memproses..." : "Ya, Turunkan Tier"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
