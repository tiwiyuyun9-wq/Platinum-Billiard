"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Check, X, Eye, ExternalLink, Calendar, Loader2, Users, Crown, Medal, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { approveMembership, rejectMembership } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface MembershipClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pendingMemberships: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeMemberships: any[];
}

export default function MembershipsClient({ pendingMemberships, activeMemberships }: MembershipClientProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [isRejectLoading, setIsRejectLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredActiveMembers = activeMemberships.filter((m) =>
        m.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tier?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: activeMemberships.length,
        platinum: activeMemberships.filter(m => m.tier === "platinum").length,
        gold: activeMemberships.filter(m => m.tier === "gold").length,
        silver: activeMemberships.filter(m => m.tier === "silver").length,
    };

    const handleApprove = async (membershipId: string) => {
        setIsActionLoading(membershipId);
        try {
            const result = await approveMembership(membershipId);
            if (result.error) {
                toast.error("Gagal menyetujui: " + result.error);
            } else {
                toast.success("Membership berhasil disetujui!");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan.");
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleReject = async (membershipId: string) => {
        if (!confirm("Apakah yakin ingin menolak request membership ini?")) return;
        setIsRejectLoading(membershipId);
        try {
            const result = await rejectMembership(membershipId);
            if (result.error) {
                toast.error("Gagal menolak: " + result.error);
            } else {
                toast.success("Membership ditolak.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan.");
        } finally {
            setIsRejectLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Manajemen Membership
                </h1>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        Menunggu Verifikasi
                        {pendingMemberships.length > 0 && (
                            <span className="ml-2 bg-emerald-500/20 text-emerald-300 py-0.5 px-2 rounded-full text-xs">
                                {pendingMemberships.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="active" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        Member Aktif
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6">

                    {pendingMemberships.length === 0 ? (
                        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-12 text-center shadow-inner flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Semua Selesai!</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto">
                                Tidak ada request membership yang menunggu verifikasi saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {pendingMemberships.map((membership) => (
                                <div key={membership.id} className="bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-zinc-700 relative group">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />

                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                                        {/* Details */}
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/50 px-3 uppercase tracking-wider text-[10px] font-bold">
                                                    Menunggu Verifikasi
                                                </Badge>
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50 px-3 uppercase tracking-wider text-[10px] font-bold">
                                                    Tier: {membership.tier}
                                                </Badge>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">
                                                    {membership.profiles?.full_name || "Unknown User"}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                                                <div>
                                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Tanggal Request</p>
                                                    <p className="text-sm font-medium text-zinc-300">
                                                        {format(new Date(membership.created_at), "dd MMM yyyy 'pukul' HH:mm", { locale: id })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Berlaku Hingga</p>
                                                    <p className="text-sm font-medium text-zinc-300">
                                                        {membership.end_date ? format(new Date(membership.end_date), "dd MMM yyyy", { locale: id }) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proof & Actions */}
                                        <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto shrink-0">
                                            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl flex items-center justify-center relative group/img cursor-pointer transition-colors hover:bg-zinc-800"
                                                onClick={() => setSelectedImage(membership.payment_proof_url)}>
                                                {membership.payment_proof_url ? (
                                                    <div className="relative w-full sm:w-48 h-32 md:h-28 overflow-hidden rounded-lg">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={membership.payment_proof_url}
                                                            alt="Bukti Transfer"
                                                            className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Eye className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full sm:w-48 h-32 md:h-28 rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600">
                                                        <ExternalLink className="w-6 h-6 mb-2" />
                                                        <span className="text-xs font-medium">Tidak ada foto</span>
                                                    </div>
                                                )}
                                                <div className="absolute -top-3 -right-3">
                                                    <span className="flex h-6 w-6 relative">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 items-center justify-center">
                                                            <span className="text-black text-[10px] font-bold">!</span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-900/50 bg-red-950/20 text-red-500 hover:bg-red-900/50 hover:text-red-300"
                                                    onClick={() => handleReject(membership.id)}
                                                    disabled={isRejectLoading === membership.id || isActionLoading === membership.id}
                                                >
                                                    {isRejectLoading === membership.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                                                    Tolak
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                    onClick={() => handleApprove(membership.id)}
                                                    disabled={isActionLoading === membership.id || isRejectLoading === membership.id}
                                                >
                                                    {isActionLoading === membership.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                                    Terima
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="active" className="space-y-8 animate-in fade-in-50 duration-500">
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Users className="w-5 h-5 text-zinc-400" />
                                </div>
                                <h3 className="text-sm font-medium text-zinc-400">Total Member</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <Crown className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Crown className="w-5 h-5 text-zinc-300" />
                                </div>
                                <h3 className="text-sm font-medium text-zinc-400">Platinum</h3>
                            </div>
                            <p className="text-3xl font-bold text-white relative z-10">{stats.platinum}</p>
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900 to-amber-950/20 border border-amber-900/30 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <Medal className="w-24 h-24 text-amber-500" />
                            </div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="p-2 bg-amber-950/50 rounded-lg">
                                    <Medal className="w-5 h-5 text-amber-500" />
                                </div>
                                <h3 className="text-sm font-medium text-amber-500/80">Gold</h3>
                            </div>
                            <p className="text-3xl font-bold text-white relative z-10">{stats.gold}</p>
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900 to-slate-800/20 border border-slate-700/30 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <Medal className="w-24 h-24 text-slate-400" />
                            </div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="p-2 bg-slate-800/50 rounded-lg">
                                    <Medal className="w-5 h-5 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-medium text-slate-400">Silver</h3>
                            </div>
                            <p className="text-3xl font-bold text-white relative z-10">{stats.silver}</p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/50">
                            <h3 className="text-lg font-bold text-white">Daftar Member Aktif</h3>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    placeholder="Cari nama atau tier..."
                                    className="pl-9 bg-zinc-950 border-zinc-800"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Pengguna</th>
                                        <th className="px-6 py-4 font-medium">Tier Membership</th>
                                        <th className="px-6 py-4 font-medium">Mulai Bergabung</th>
                                        <th className="px-6 py-4 font-medium">Berakhir Pada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredActiveMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                                Tidak ada data member aktif ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredActiveMembers.map((member) => (
                                            <tr key={member.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {member.profiles?.full_name || "Unknown"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`uppercase tracking-wider text-[10px] font-bold ${member.tier === 'platinum' ? 'bg-zinc-100 text-zinc-900 border-zinc-300' :
                                                        member.tier === 'gold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' :
                                                            'bg-slate-500/10 text-slate-400 border-slate-500/50'
                                                        }`}>
                                                        {member.tier}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">
                                                    {member.start_date ? format(new Date(member.start_date), "dd MMM yyyy", { locale: id }) : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-300">
                                                        {member.end_date ? format(new Date(member.end_date), "dd MMM yyyy", { locale: id }) : '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={!!selectedImage} onOpenChange={(o) => !o && setSelectedImage(null)}>
                <DialogContent className="max-w-3xl bg-zinc-950 border-zinc-800 p-1">
                    <VisuallyHidden.Root>
                        <DialogTitle>Bukti Transfer</DialogTitle>
                    </VisuallyHidden.Root>
                    {selectedImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={selectedImage}
                            alt="Bukti Transfer Penuh"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
