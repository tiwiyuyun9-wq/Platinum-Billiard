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
import { BookingHistoryClient } from "@/components/features/profile/BookingHistoryClient";

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
        .select("*, tables(name)")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false });

    const brandColors: Record<string, string> = {
        standard: "bg-zinc-800 text-zinc-300 border-zinc-700",
        silver: "bg-zinc-300 text-zinc-900 border-zinc-400",
        gold: "bg-amber-400 text-amber-950 border-amber-500",
        platinum: "bg-zinc-100 text-zinc-950 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]",
    };

    // Fetch QRIS Settings
    const { data: settings } = await supabase
        .from("settings")
        .select("qris_image_url")
        .eq("id", 1)
        .single();


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
                        <BookingHistoryClient bookings={bookings || []} qrisUrl={settings?.qris_image_url || null} />
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
