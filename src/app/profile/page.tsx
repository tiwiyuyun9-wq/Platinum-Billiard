import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CreditCard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/features/profile/ProfileForm";

export default async function ProfilePage({ searchParams }: { searchParams: { tab?: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const activeTab = searchParams?.tab || "history";
    // ... rest of fetch logic ...


    // Fetch Membership
    const { data: membership } = await supabase
        .from("memberships")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("end_date", { ascending: false })
        .limit(1)
        .single();

    // Fetch Bookings
    const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false });

    const brandColors: Record<string, string> = {
        standard: "bg-zinc-800 text-zinc-300 border-zinc-700",
        silver: "bg-zinc-300 text-zinc-900 border-zinc-400",
        gold: "bg-amber-400 text-amber-950 border-amber-500",
        platinum: "bg-zinc-100 text-zinc-950 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]",
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-40 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                    <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-zinc-800 shadow-xl">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-zinc-400">
                                {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {membership && (
                            <div className="absolute -bottom-2 -right-2">
                                <Badge className={`${brandColors[membership.tier] || "bg-zinc-800"} px-3 py-1 uppercase text-xs font-bold border rounded-full shadow-lg`}>
                                    {membership.tier}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white">{user.user_metadata?.full_name || "Pengguna Billiard"}</h1>
                        <p className="text-zinc-400">{user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                            {!membership && (
                                <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border-0 shadow-lg shadow-emerald-900/20" asChild>
                                    <Link href="/membership">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Beli Membership
                                    </Link>
                                </Button>
                            )}
                            <form action="/auth/signout" method="post">
                                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-white/5">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Keluar
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Tabs Config */}
                <Tabs defaultValue={activeTab} className="space-y-8">
                    <TabsList className="bg-zinc-900/50 p-1 border border-white/5 rounded-full">
                        <TabsTrigger value="history" className="rounded-full px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            <Clock className="w-4 h-4 mr-2" />
                            Riwayat Booking
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-full px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            <Settings className="w-4 h-4 mr-2" />
                            Pengaturan
                        </TabsTrigger>
                    </TabsList>

                    {/* Booking History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <div className="grid gap-4">
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <Card key={booking.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden group">
                                        <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                                            {/* Date Box */}
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-zinc-950 rounded-xl w-16 h-16 border border-zinc-800 shadow-inner">
                                                <span className="text-xs text-zinc-500 uppercase font-bold">DATE</span>
                                                <span className="text-xl font-bold text-white">
                                                    {new Date(booking.start_time).getDate()}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-grow space-y-1">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    Meja {booking.table_id}
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${booking.status === 'confirmed' ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" :
                                                        booking.status === 'pending_payment' ? "bg-amber-950/30 text-amber-400 border-amber-900/50" :
                                                            "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                        }`}>
                                                        {booking.status?.replace('_', ' ')}
                                                    </span>
                                                </h3>
                                                <div className="flex items-center text-zinc-400 text-sm gap-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(booking.start_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-lg font-bold text-emerald-400">
                                                    Rp {booking.total_price?.toLocaleString('id-ID')}
                                                </span>
                                                {booking.status === 'pending_payment' && (
                                                    <Button size="sm" variant="secondary" className="h-8 text-xs">
                                                        Bayar Sekarang
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                                        <Calendar className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl space-y-3">
                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                            Anda belum pernah melakukan booking meja. Yuk, booking meja sekarang dan nikmati permainannya!
                                        </p>
                                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                                            <Link href="/booking">Booking Meja</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <ProfileForm user={user} />
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
