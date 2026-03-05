"use client";

import { useState } from "react";
import { Star, PenLine, ThumbsUp, Share2, MoreVertical, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { ReviewFormModal } from "@/components/features/home/ReviewFormModal";
import { formatDistanceToNowStrict } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const mockTestimonials = [
    {
        name: "Christina Rika",
        role: "Local Guide",
        content: "Salah satu billiard yang murah di Banjarnegara, banyak promo juga. Tempat luas, meja yg disediakan banyak. Menu makanannya sangat bervariasi dan enak.",
        rating: 4,
        avatar: "CR",
        created_at: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        admin_reply: null,
        admin_reply_at: null,
        media_urls: [],
    },
    {
        name: "Denmas Idin",
        role: "Pelanggan Setia",
        content: "Baru sekali kesini, pelayanan cepat dan makanannya enak-enak. Tempat juga lumayan nyaman untuk pemain pemula ataupun expert. Lokasi sangat strategis.",
        rating: 5,
        avatar: "DI",
        created_at: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        admin_reply: "Terima kasih banyak atas kunjungannya kak! Ditunggu kedatangannya kembali. 🙏",
        admin_reply_at: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        media_urls: [],
    },
    {
        name: "Budi Santoso",
        role: "Member Platinum",
        content: "Meja di Platinum Billiard sangat mulus dan terawat. Suasananya nyaman banget buat latihan fokus berjam-jam tanpa gangguan.",
        rating: 5,
        avatar: "BS",
        created_at: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        admin_reply: null,
        admin_reply_at: null,
        media_urls: [],
    },
];

export interface ReviewData {
    id: string;
    rating: number;
    content: string;
    created_at?: string;
    admin_reply?: string | null;
    admin_reply_at?: string | null;
    media_urls?: string[];
    profiles: {
        full_name: string;
        role: string | null;
    } | null;
}

interface TestimonialSectionProps {
    reviews?: ReviewData[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any | null;
}

export function TestimonialSection({ reviews = [], user = null }: TestimonialSectionProps) {
    const [authOpen, setAuthOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const handleWriteReviewClick = () => {
        if (!user) {
            setAuthOpen(true);
        } else {
            setReviewModalOpen(true);
        }
    };

    // Use fetched reviews or fallback to the hardcoded testimonials if empty
    const displayReviews = reviews && reviews.length > 0
        ? reviews.map(r => ({
            name: r.profiles?.full_name || "Pengguna Anonim",
            role: r.profiles?.role === "admin" ? "Admin" : "Pelanggan",
            content: r.content,
            rating: r.rating,
            avatar: r.profiles?.full_name ? r.profiles.full_name.charAt(0).toUpperCase() : "U",
            created_at: r.created_at || new Date().toISOString(),
            admin_reply: r.admin_reply || null,
            admin_reply_at: r.admin_reply_at || null,
            media_urls: r.media_urls || [],
        }))
        : mockTestimonials;

    const totalReviews = displayReviews.length;
    const avgRatingRaw = totalReviews > 0 ? displayReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0;
    const avgRatingText = avgRatingRaw.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    displayReviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
            ratingCounts[r.rating as keyof typeof ratingCounts]++;
        }
    });

    const renderStars = (rating: number, size = "w-4 h-4") => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className={`${size} fill-amber-500 text-amber-500`} />
                ))}
                {hasHalfStar && (
                    <StarHalf key="half" className={`${size} fill-amber-500 text-amber-500`} />
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className={`${size} fill-transparent text-zinc-700`} />
                ))}
            </div>
        );
    };

    return (
        <section className="py-24 relative bg-zinc-950 border-t border-zinc-900">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* LEFT COLUMN: Google Maps Style Summary */}
                    <div className="lg:w-1/3 flex flex-col shrink-0">
                        <h2 className="text-2xl font-semibold text-white mb-8">Ringkasan ulasan</h2>

                        <div className="flex items-start justify-between mb-8">
                            <div className="flex-grow space-y-2.5 max-w-[200px]">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-zinc-400 w-3 shrink-0">{star}</span>
                                        <div className="h-2.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full relative"
                                                style={{ width: totalReviews > 0 ? `${(ratingCounts[star as keyof typeof ratingCounts] / totalReviews) * 100}%` : '0%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center pl-6 ml-auto border-l border-zinc-800">
                                <span className="text-6xl font-light text-white leading-none tracking-tighter mb-2">
                                    {avgRatingText}
                                </span>
                                {renderStars(avgRatingRaw, "w-3.5 h-3.5")}
                                <span className="text-xs text-emerald-500/80 mt-2 font-medium">
                                    {totalReviews.toLocaleString('id-ID')} ulasan
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={handleWriteReviewClick}
                            className="w-fit rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 shadow-none font-medium px-6"
                        >
                            <PenLine className="w-4 h-4 mr-2" />
                            Tulis ulasan
                        </Button>
                    </div>

                    {/* RIGHT COLUMN: Review List */}
                    <div className="lg:w-2/3 space-y-8 lg:border-l lg:border-zinc-800/50 lg:pl-12">
                        {displayReviews.map((rev, index) => {
                            const dateStr = formatDistanceToNowStrict(new Date(rev.created_at), { addSuffix: true, locale: idLocale });

                            return (
                                <div key={index} className="border-b border-zinc-800/50 pb-8 last:border-0 relative group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg">
                                                {rev.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-zinc-100 font-medium">{rev.name}</span>
                                                <span className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                                                    {rev.role}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        {renderStars(rev.rating, "w-3.5 h-3.5")}
                                        <span className="text-sm text-zinc-500">{dateStr}</span>
                                    </div>

                                    <p className="text-zinc-300 leading-relaxed font-light">
                                        &quot;{rev.content}&quot;
                                    </p>

                                    {rev.media_urls && rev.media_urls.length > 0 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
                                            {rev.media_urls.map((url, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg bg-zinc-800 border border-zinc-700/50 overflow-hidden shrink-0">
                                                    {url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') ? (
                                                        <video src={url} className="w-full h-full object-cover" controls />
                                                    ) : (
                                                        <img src={url} alt={`Review media ${idx + 1}`} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {rev.admin_reply && (
                                        <div className="mt-4 bg-zinc-900/80 border border-zinc-800/50 rounded-lg p-4 relative ml-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-emerald-500">Balasan dari Management</span>
                                                {rev.admin_reply_at && (
                                                    <span className="text-[10px] text-zinc-500">
                                                        {formatDistanceToNowStrict(new Date(rev.admin_reply_at), { addSuffix: true, locale: idLocale })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed">
                                                {rev.admin_reply}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 mt-5">
                                        <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors hover:bg-zinc-900 px-3 py-1.5 -ml-3 rounded-full">
                                            <ThumbsUp className="w-4 h-4" />
                                            Suka
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors hover:bg-zinc-900 px-3 py-1.5 rounded-full">
                                            <Share2 className="w-4 h-4" />
                                            Bagikan
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AuthModal
                open={authOpen}
                onOpenChange={setAuthOpen}
                defaultMode="login"
            />

            <ReviewFormModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                userFullName={user?.user_metadata?.full_name || null}
            />
        </section>
    );
}
