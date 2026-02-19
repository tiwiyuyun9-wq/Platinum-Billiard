import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DigitalMemberCard } from "@/components/features/membership/DigitalMemberCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, History, Star, Zap } from "lucide-react";
import Link from "next/link";

export default async function MyMembershipPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/?action=login");
    }

    // Fetch active membership
    const { data: membership } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("end_date", { ascending: false })
        .limit(1)
        .single();

    // Determine Benefits based on tier
    // (In a real app, this should be fetched from a tiers config/table)
    const getBenefits = (tier: string) => {
        const t = tier?.toLowerCase();
        if (t === 'platinum') return ['Diskon 25%', 'VVIP Access', 'Prioritas H-7', 'Free FnB'];
        if (t === 'gold') return ['Diskon 15%', 'Prioritas H-3', 'Free Drink', 'Locker'];
        if (t === 'silver') return ['Diskon 10%', 'Booking H-1'];
        return ['Akses Booking', 'Poin Reward'];
    }

    const currentTier = membership?.tier || "Standard";
    const benefits = getBenefits(currentTier);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">

                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Left Column: Card & Quick Actions */}
                    <div className="w-full md:w-1/3 space-y-8">
                        <div className="relative group perspective-1000">
                            <DigitalMemberCard user={user} membership={membership} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                                <Link href="/reservasi">
                                    Book Meja
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800" size="lg">
                                <Link href="/membership">
                                    Upgrade
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Details & History */}
                    <div className="w-full md:w-2/3 space-y-6">

                        {/* Status Card */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center justify-between">
                                    <span>Status Membership</span>
                                    {membership ? (
                                        <span className="text-sm font-normal px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="text-sm font-normal px-3 py-1 rounded-full bg-zinc-800 text-zinc-400">
                                            Basic
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Detail paket langganan Anda saat ini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Tipe Membership</p>
                                        <p className="text-xl font-bold text-white capitalize">{currentTier}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Berlaku Hingga</p>
                                        <p className="text-xl font-bold text-white">
                                            {membership?.end_date
                                                ? new Date(membership.end_date).toLocaleDateString("id-ID", { dateStyle: "long" })
                                                : "Selamanya"
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Mulai Member</p>
                                        <p className="text-lg text-zinc-300">
                                            {membership?.start_date
                                                ? new Date(membership.start_date).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })
                                                : "-"
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Auto Renewal</p>
                                        <p className="text-lg text-zinc-300">Manual</p>
                                    </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                <div>
                                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500" /> Benefit Aktif
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-3 text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                                <Zap className="w-4 h-4 text-amber-400" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent History Prompt */}
                        <Card className="bg-zinc-900 border-zinc-800 opacity-75 hover:opacity-100 transition-opacity">
                            <Link href="/profile?tab=history">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <History className="w-6 h-6 text-zinc-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Riwayat Booking</h4>
                                            <p className="text-sm text-zinc-500">Lihat riwayat pemakaian meja Anda</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-500" />
                                </CardContent>
                            </Link>
                        </Card>

                    </div>
                </div>
            </div>
        </main>
    );
}
