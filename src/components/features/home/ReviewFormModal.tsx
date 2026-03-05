"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/components/features/home/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    userFullName: string | null;
}

export function ReviewFormModal({ isOpen, onClose, userFullName }: ReviewFormModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(file => {
                const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
                const isUnder10MB = file.size <= 10 * 1024 * 1024;
                if (!isImageOrVideo) toast.error(`${file.name} bukan format media yang valid.`);
                if (!isUnder10MB) toast.error(`${file.name} melebihi batas 10MB.`);
                return isImageOrVideo && isUnder10MB;
            });
            setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
        }
    };

    const removeAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

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
            const supabase = createClient();
            const mediaUrls: string[] = [];

            // 1. Upload Attachments
            if (attachments.length > 0) {
                for (let i = 0; i < attachments.length; i++) {
                    const file = attachments[i];
                    setUploadProgress(`Mengunggah media ${i + 1} dari ${attachments.length}...`);

                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `reviews/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('web-assets')
                        .upload(filePath, file);

                    if (uploadError) {
                        toast.error(`Gagal mengunggah ${file.name}`);
                        continue;
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('web-assets')
                        .getPublicUrl(filePath);

                    if (publicUrlData) {
                        mediaUrls.push(publicUrlData.publicUrl);
                    }
                }
            }
            setUploadProgress("");

            // 2. Submit Review Form
            const result = await submitReview(rating, content, mediaUrls);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Terima kasih! Ulasan Anda telah diposting.");
                setContent("");
                setRating(0);
                setAttachments([]);
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
                        className="min-h-[120px] bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-500 text-base resize-none"
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        disabled={isSubmitting}
                    />

                    {/* Media Attachments */}
                    <div className="space-y-3">
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden group">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-medium">VIDEO</div>
                                        )}
                                        {!isSubmitting && (
                                            <button
                                                onClick={() => removeAttachment(idx)}
                                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isSubmitting && attachments.length < 5 && (
                            <div className="flex items-center">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-sm font-medium text-zinc-300 transition-colors">
                                    <ImagePlus className="w-4 h-4 text-emerald-500" />
                                    Tambahkan Foto / Video
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/mp4,video/quicktime"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                    />
                                </label>
                                <span className="ml-3 text-xs text-zinc-500">{attachments.length}/5 (Maks. 10MB/file)</span>
                            </div>
                        )}
                        {uploadProgress && (
                            <p className="text-sm text-emerald-500 font-medium animate-pulse">
                                {uploadProgress}
                            </p>
                        )}
                    </div>

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
