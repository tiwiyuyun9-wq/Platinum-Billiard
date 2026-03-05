"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/components/features/home/actions";
import { useRouter } from "next/navigation";

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    userFullName: string | null;
}

export function ReviewFormModal({ isOpen, onClose, userFullName }: ReviewFormModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Silakan pilih rating bintang terlebih dahulu.");
            return;
        }
        if (!content.trim()) {
            toast.error("Bagikan pengalaman Anda di kolom ulasan.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitReview(rating, content);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Terima kasih! Ulasan Anda telah diposting.");
                setContent("");
                setRating(0);
                onClose();
                router.refresh();
            }
        } catch {
            toast.error("Terjadi kesalahan sistem saat mengirim ulasan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                        {userFullName ? userFullName.charAt(0) : "U"}
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-white">
                            {userFullName || "Pengguna"}
                        </DialogTitle>
                        <p className="text-sm text-zinc-400">Membagikan ulasan ke publik</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none focus-visible:ring-2 ring-emerald-500 rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                            ? "fill-amber-500 text-amber-500"
                                            : "fill-zinc-800 text-zinc-700"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-emerald-500 min-h-[20px]">
                            {rating === 1 && "Sangat Buruk"}
                            {rating === 2 && "Buruk"}
                            {rating === 3 && "Biasa Saja"}
                            {rating === 4 && "Bagus"}
                            {rating === 5 && "Sangat Luar Biasa"}
                        </p>
                    </div>

                    <Textarea
                        placeholder="Bagikan detail pengalaman Anda di tempat ini..."
                        className="min-h-[150px] bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-500 text-base resize-none"
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        disabled={isSubmitting}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0 || !content.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Posting"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
