"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Star, MessageSquare, Trash2, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { deleteReview, replyToReview } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
    const [reviews, setReviews] = useState(initialReviews);

    // Reply Modal State
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Loading State
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openReplyModal = (review: any) => {
        setSelectedReview(review);
        setReplyContent(review.admin_reply || "");
        setReplyModalOpen(true);
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) {
            toast.error("Balasan tidak boleh kosong");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await replyToReview(selectedReview.id, replyContent);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Balasan berhasil disimpan!");
                // Optimistic UI update
                setReviews(reviews.map(r => r.id === selectedReview.id ? { ...r, admin_reply: replyContent, admin_reply_at: new Date().toISOString() } : r));
                setReplyModalOpen(false);
            }
        } catch {
            toast.error("Gagal mengirim balasan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?")) return;

        setDeletingId(reviewId);
        try {
            const result = await deleteReview(reviewId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Ulasan berhasil dihapus!");
                setReviews(reviews.filter(r => r.id !== reviewId));
            }
        } catch {
            toast.error("Gagal menghapus ulasan.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Manajemen Ulasan
            </h1>

            <div className="grid gap-4">
                {reviews.length === 0 ? (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400 flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 mb-4 text-zinc-600" />
                        <p>Belum ada ulasan yang masuk.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative group overflow-hidden">
                            <div className="flex justify-between items-start gap-4">

                                {/* User Info & Rating */}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-500 flex flex-col items-center justify-center font-bold text-lg border border-emerald-500/20 shrink-0">
                                        {review.profiles?.full_name?.charAt(0) || "U"}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-zinc-100 font-semibold text-lg flex items-center gap-2">
                                            {review.profiles?.full_name || "Tanpa Nama"}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "fill-zinc-800 text-zinc-700"}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-zinc-500">
                                                {format(new Date(review.created_at), "dd MMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        <p className="text-zinc-300 mt-3 font-light leading-relaxed">
                                            &quot;{review.content}&quot;
                                        </p>
                                        {review.media_urls && review.media_urls.length > 0 && (
                                            <div className="flex gap-2 mt-3 flex-wrap">
                                                {review.media_urls.map((url: string, idx: number) => (
                                                    <div key={idx} className="relative w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700">
                                                        {url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') ? (
                                                            <video src={url} className="w-full h-full object-cover pointer-events-none" />
                                                        ) : (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={url} alt="Review attachment" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700 hover:bg-zinc-800 text-zinc-200"
                                        onClick={() => openReplyModal(review)}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
                                        Balas
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                        onClick={() => handleDelete(review.id)}
                                        disabled={deletingId === review.id}
                                    >
                                        {deletingId === review.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Admin Reply Block */}
                            {review.admin_reply && (
                                <div className="mt-5 ml-16 bg-zinc-900 border border-zinc-800 rounded-lg p-5 relative">
                                    <div className="absolute -left-3 top-6 text-zinc-700">
                                        <Quote className="w-6 h-6 rotate-180" />
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-emerald-400">Balasan dari Management</span>
                                        {review.admin_reply_at && (
                                            <span className="text-xs text-zinc-500">
                                                {format(new Date(review.admin_reply_at), "dd MMM yyyy", { locale: id })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        {review.admin_reply}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Balas Ulasan</DialogTitle>
                    </DialogHeader>

                    {selectedReview && (
                        <div className="space-y-4 pt-4">
                            <div className="bg-zinc-900/50 p-4 border border-zinc-800/50 rounded-lg">
                                <p className="text-zinc-400 text-sm mb-2">Mengutip {selectedReview.profiles?.full_name}:</p>
                                <p className="text-zinc-300 italic text-sm">&quot;{selectedReview.content}&quot;</p>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Tuliskan balasan resmi Anda di sini..."
                                    className="min-h-[150px] bg-zinc-900 border-zinc-800 focus-visible:ring-emerald-500 text-base resize-none"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setReplyModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleReplySubmit}
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isSubmitting ? "Menyimpan..." : "Kirim Balasan"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
