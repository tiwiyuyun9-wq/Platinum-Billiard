"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, History, Users, Plus, CheckCircle, XCircle, Loader2, Upload, Coins, Settings, ListChecks, Clock, Coffee, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { createReward, updateReward, deleteReward, updateRedemptionStatus, adjustUserPoints } from "./actions";
import { createClient } from "@/utils/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RewardsDashboardClient({ initialRewards, initialRedemptions, initialUserPoints, initialSettings, initialEarningMethods }: { initialRewards: any[], initialRedemptions: any[], initialUserPoints: any[], initialSettings: any, initialEarningMethods: any[] }) {
    const [rewards] = useState(initialRewards);
    const [redemptions] = useState(initialRedemptions);
    const [userPoints] = useState(initialUserPoints);
    const [settings, setSettings] = useState(initialSettings);
    const [earningMethods] = useState(initialEarningMethods);

    // States for Modals
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedReward, setSelectedReward] = useState<any | null>(null);
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEarningMethodModalOpen, setIsEarningMethodModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedEarningMethod, setSelectedEarningMethod] = useState<any | null>(null);

    // Form States
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [rewardFile, setRewardFile] = useState<File | null>(null);
    const [rewardPreview, setRewardPreview] = useState<string | null>(null);

    const supabase = createClient();

    // ==========================================
    // REWARDS LOGIC
    // ==========================================

    const handleRewardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setRewardFile(e.target.files[0]);
            setRewardPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleRewardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Upload Image if present
            if (rewardFile) {
                const fileExt = rewardFile.name.split('.').pop();
                const fileName = `reward-${Date.now()}.${fileExt}`;
                const filePath = `rewards/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('web-assets')
                    .upload(filePath, rewardFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('web-assets')
                    .getPublicUrl(filePath);

                formData.set("image_url", publicUrl);
            } else if (selectedReward?.image_url) {
                formData.set("image_url", selectedReward.image_url);
            }

            // Defaults
            if (!formData.has("is_active")) formData.set("is_active", "false");
            if (!formData.get("stock")) formData.set("stock", "-1");

            let result;
            if (selectedReward) {
                result = await updateReward(selectedReward.id, formData);
            } else {
                result = await createReward(formData);
            }

            if (result.error) throw new Error(result.error);

            toast.success(selectedReward ? "Reward diperbarui!" : "Reward ditambahkan!");
            setIsRewardModalOpen(false);
            setRewardFile(null);
            setRewardPreview(null);
            setSelectedReward(null);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReward = async (id: string) => {
        if (!confirm("Hapus reward ini? Anda mungkin tidak bisa jika sudah ada yang redeem.")) return;
        setIsLoading(true);
        const res = await deleteReward(id);
        if (res.error) toast.error(res.error);
        else toast.success("Reward dihapus!");
        setIsLoading(false);
    }

    // ==========================================
    // REDEMPTIONS LOGIC
    // ==========================================

    const handleFulfillStatus = async (redemptionId: string, status: 'fulfilled' | 'rejected', pointsCost: number, userId: string) => {
        if (!confirm(`Tandai sebagai ${status}?`)) return;
        setIsLoading(true);
        const res = await updateRedemptionStatus(redemptionId, status, pointsCost, userId);
        if (res.error) toast.error(res.error);
        else toast.success(`Status diperbarui menjadi ${status}`);
        setIsLoading(false);
    }

    // ==========================================
    // POINTS LOGIC
    // ==========================================

    const handlePointsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const amount = parseInt(formData.get("amount") as string);
            const type = formData.get("type") as string;
            const desc = formData.get("description") as string;

            const finalAmount = type === "add" ? amount : -amount;

            const res = await adjustUserPoints(selectedUser.user_id, finalAmount, desc);
            if (res.error) throw new Error(res.error);

            toast.success("Saldo poin berhasil disesuaikan!");
            setIsPointsModalOpen(false);
            setSelectedUser(null);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Gagal mengatur poin.");
        } finally {
            setIsLoading(false);
        }
    }

    // ==========================================
    // SETTINGS LOGIC
    // ==========================================

    const handlePointSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            const formData = new FormData(e.currentTarget);

            // Dynamic import
            const { updatePointSettings } = await import("./actions");

            const res = await updatePointSettings(formData);
            if (res.error) throw new Error(res.error);

            toast.success("Pengaturan poin berhasil disimpan!");
            setSettings({
                ...settings,
                points_per_booking: parseInt(formData.get("points_per_booking") as string),
                points_per_order: parseInt(formData.get("points_per_order") as string)
            });
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Gagal menyimpan pengaturan.");
        } finally {
            setIsSavingSettings(false);
        }
    }

    // ==========================================
    // EARNING METHODS LOGIC
    // ==========================================

    const handleEarningMethodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const { createEarningMethod, updateEarningMethod } = await import("./actions");

            let result;
            if (selectedEarningMethod) {
                result = await updateEarningMethod(selectedEarningMethod.id, formData);
            } else {
                result = await createEarningMethod(formData);
            }

            if (result.error) throw new Error(result.error);

            toast.success(selectedEarningMethod ? "Cara mendapat poin diperbarui!" : "Cara mendapat poin ditambahkan!");
            setIsEarningMethodModalOpen(false);
            setSelectedEarningMethod(null);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteEarningMethod = async (id: string) => {
        if (!confirm("Hapus cara mendapatkan poin ini?")) return;
        setIsLoading(true);
        try {
            const { deleteEarningMethod } = await import("./actions");
            const res = await deleteEarningMethod(id);
            if (res.error) throw new Error(res.error);
            toast.success("Berhasil dihapus!");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
        } finally {
            setIsLoading(false);
        }
    }

    const renderMethodIcon = (iconName: string) => {
        switch (iconName) {
            case 'Clock': return <Clock className="w-5 h-5" />;
            case 'Coffee': return <Coffee className="w-5 h-5" />;
            case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
            default: return <Gift className="w-5 h-5" />;
        }
    };

    return (
        <div>
            <Tabs defaultValue="catalog" className="space-y-6">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="catalog" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">
                        <Gift className="w-4 h-4 mr-2" />
                        Katalog Reward
                    </TabsTrigger>
                    <TabsTrigger value="claims" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">
                        <History className="w-4 h-4 mr-2" />
                        Penukaran Poin
                    </TabsTrigger>
                    <TabsTrigger value="points" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">
                        <Users className="w-4 h-4 mr-2" />
                        Saldo Anggota
                    </TabsTrigger>
                    <TabsTrigger value="earning_methods" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">
                        <ListChecks className="w-4 h-4 mr-2" />
                        Cara Mendapat Poin
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">
                        <Settings className="w-4 h-4 mr-2" />
                        Pengaturan
                    </TabsTrigger>
                </TabsList>

                {/* 1. REWARDS CATALOG */}
                <TabsContent value="catalog" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Daftar Hadiah</h2>
                        <Button onClick={() => { setSelectedReward(null); setRewardPreview(null); setIsRewardModalOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Reward
                        </Button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Gambar</TableHead>
                                    <TableHead className="text-zinc-400">Nama Item</TableHead>
                                    <TableHead className="text-zinc-400">Harga (Poin)</TableHead>
                                    <TableHead className="text-zinc-400">Stok</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rewards.length === 0 ? (
                                    <TableRow className="border-zinc-800"><TableCell colSpan={6} className="text-center py-8 text-zinc-500">Belum ada data reward.</TableCell></TableRow>
                                ) : rewards.map((r) => (
                                    <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell>
                                            <div className="w-12 h-12 rounded bg-zinc-800 overflow-hidden relative border border-zinc-700">
                                                {r.image_url ? (
                                                    <Image src={r.image_url} alt={r.title} fill className="object-cover" />
                                                ) : <Gift className="w-6 h-6 m-3 text-zinc-600" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-200">{r.title}</TableCell>
                                        <TableCell className="text-emerald-400 font-bold">{r.points_cost} Pts</TableCell>
                                        <TableCell>{r.stock < 0 ? "Tak Terbatas" : r.stock}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${r.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                                                {r.is_active ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => { setSelectedReward(r); setRewardPreview(r.image_url); setIsRewardModalOpen(true) }} className="border-zinc-700 text-zinc-300">Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteReward(r.id)} className="bg-red-500/10 text-red-500 border-0 hover:bg-red-500/20">Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* 2. REDEMPTIONS */}
                <TabsContent value="claims" className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Pengajuan Penukaran</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Tanggal</TableHead>
                                    <TableHead className="text-zinc-400">Anggota</TableHead>
                                    <TableHead className="text-zinc-400">Hadiah Ditukar</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-right text-zinc-400">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {redemptions.length === 0 ? (
                                    <TableRow className="border-zinc-800"><TableCell colSpan={5} className="text-center py-8 text-zinc-500">Tidak ada pengajuan penukaran.</TableCell></TableRow>
                                ) : redemptions.map((r) => (
                                    <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-zinc-300">{format(new Date(r.created_at), "dd MMM yyyy HH:mm", { locale: id })}</TableCell>
                                        <TableCell>
                                            <div className="text-zinc-200 font-medium">{r.profiles?.full_name || 'User Tanpa Nama'}</div>
                                            <div className="text-xs text-zinc-500">{r.profiles?.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-emerald-400 font-medium">{r.rewards?.title}</div>
                                            <div className="text-xs text-zinc-500">-{r.rewards?.points_cost} Pts</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === 'fulfilled' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {r.status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {r.status === 'pending' && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => handleFulfillStatus(r.id, 'fulfilled', r.rewards.points_cost, r.user_id)} className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400">
                                                        <CheckCircle className="w-4 h-4 mr-1" /> Selesaikan
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleFulfillStatus(r.id, 'rejected', r.rewards.points_cost, r.user_id)} className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400">
                                                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* 3. USER POINTS */}
                <TabsContent value="points" className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Saldo Poin Anggota</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Nama Anggota</TableHead>
                                    <TableHead className="text-zinc-400">Email</TableHead>
                                    <TableHead className="text-zinc-400">Poin Saat Ini</TableHead>
                                    <TableHead className="text-zinc-400">Trakhir Update</TableHead>
                                    <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userPoints.length === 0 ? (
                                    <TableRow className="border-zinc-800"><TableCell colSpan={5} className="text-center py-8 text-zinc-500">Belum ada data poin pengguna.</TableCell></TableRow>
                                ) : userPoints.map((u) => (
                                    <TableRow key={u.user_id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-medium text-zinc-200">{u.profiles?.full_name || 'Tidak ada nama'}</TableCell>
                                        <TableCell className="text-zinc-400">{u.profiles?.email}</TableCell>
                                        <TableCell className="text-emerald-400 font-bold text-lg">{u.current_points}</TableCell>
                                        <TableCell className="text-zinc-500 text-sm">{format(new Date(u.updated_at), "dd MMM yyyy", { locale: id })}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => { setSelectedUser(u); setIsPointsModalOpen(true); }} className="border-zinc-700 text-zinc-300">
                                                <Coins className="w-4 h-4 mr-1" /> Adjust Poin
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* 4. SETTINGS */}
                <TabsContent value="settings" className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Pengaturan Generasi Poin</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl">
                        <form onSubmit={handlePointSettingsSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="points_per_booking" className="text-zinc-300">Poin Hadiah per Booking Meja</Label>
                                <Input
                                    id="points_per_booking"
                                    name="points_per_booking"
                                    type="number"
                                    defaultValue={settings?.points_per_booking || 0}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                                <p className="text-xs text-zinc-500">Berapa poin yang didapat pengguna secara otomatis saat booking meja selesai.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="points_per_order" className="text-zinc-300">Poin Hadiah per Pesanan Cafe & Resto</Label>
                                <Input
                                    id="points_per_order"
                                    name="points_per_order"
                                    type="number"
                                    defaultValue={settings?.points_per_order || 0}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                                <p className="text-xs text-zinc-500">Poin yang didapat untuk setiap item resto/cafe yang dipesan.</p>
                            </div>

                            <Button type="submit" disabled={isSavingSettings} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                                {isSavingSettings ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Simpan Pengaturan
                            </Button>
                        </form>
                    </div>
                </TabsContent>

                {/* 5. EARNING METHODS */}
                <TabsContent value="earning_methods" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Cara Mendapatkan Poin</h2>
                        <Button onClick={() => { setSelectedEarningMethod(null); setIsEarningMethodModalOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Cara
                        </Button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-950/50">
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-400 w-16 text-center">Ikon</TableHead>
                                    <TableHead className="text-zinc-400">Judul</TableHead>
                                    <TableHead className="text-zinc-400">Deskripsi Aturan</TableHead>
                                    <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {earningMethods.length === 0 ? (
                                    <TableRow className="border-zinc-800"><TableCell colSpan={4} className="text-center py-8 text-zinc-500">Belum ada aturan cara mendapatkan poin.</TableCell></TableRow>
                                ) : earningMethods.map((m) => (
                                    <TableRow key={m.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="text-center">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                {renderMethodIcon(m.icon)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-200">{m.title}</TableCell>
                                        <TableCell className="text-zinc-400 whitespace-pre-wrap">{m.description}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => { setSelectedEarningMethod(m); setIsEarningMethodModalOpen(true) }} className="border-zinc-700 text-zinc-300">Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteEarningMethod(m.id)} className="bg-red-500/10 text-red-500 border-0 hover:bg-red-500/20">Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODAL: ADD/EDIT REWARD */}
            <Dialog open={isRewardModalOpen} onOpenChange={setIsRewardModalOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedReward ? 'Edit Reward' : 'Tambah Reward Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRewardSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Gambar Reward</Label>
                            <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer w-full h-40 flex items-center justify-center">
                                <input type="file" accept="image/*" onChange={handleRewardFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {rewardPreview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={rewardPreview} alt="Preview" className="h-full w-auto object-contain rounded-md" />
                                ) : (
                                    <div className="text-zinc-500 flex flex-col items-center">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Upload Foto (Opsional)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Nama Item <span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" required defaultValue={selectedReward?.title} className="bg-zinc-900 border-zinc-700" placeholder="Misal: Baju Billiard Premium" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="points_cost">Harga Poin <span className="text-red-500">*</span></Label>
                                <Input id="points_cost" name="points_cost" type="number" required defaultValue={selectedReward?.points_cost} className="bg-zinc-900 border-zinc-700" placeholder="5000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Total Stok (-1 = Unlimited)</Label>
                                <Input id="stock" name="stock" type="number" defaultValue={selectedReward?.stock ?? -1} className="bg-zinc-900 border-zinc-700" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" name="description" defaultValue={selectedReward?.description} className="bg-zinc-900 border-zinc-700 min-h-[80px]" placeholder="Penjelasan singkat..." />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="is_active" name="is_active" value="true" defaultChecked={selectedReward ? selectedReward.is_active : true} className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500/20" />
                            <Label htmlFor="is_active" className="cursor-pointer">Tampilkan Publik (Aktif)</Label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsRewardModalOpen(false)} className="border-zinc-700 text-zinc-300">Batal</Button>
                            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MODAL: ADJUST POINTS */}
            <Dialog open={isPointsModalOpen} onOpenChange={setIsPointsModalOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Sesuaikan Saldo Poin</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handlePointsSubmit} className="space-y-4 pt-4">
                            <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-xs text-zinc-400">Anggota</p>
                                    <p className="font-bold text-white">{selectedUser.profiles?.full_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">Saldo Poin</p>
                                    <p className="font-bold text-emerald-400">{selectedUser.current_points}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis Penyesuaian</Label>
                                <select name="type" className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                    <option value="add">Tambah Poin (+)</option>
                                    <option value="deduct">Kurangi Poin (-)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Nominal Poin</Label>
                                <Input id="amount" name="amount" type="number" required min="1" className="bg-zinc-900 border-zinc-700" placeholder="1000" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adjust_desc">Alasan/Catatan</Label>
                                <Input id="adjust_desc" name="description" required className="bg-zinc-900 border-zinc-700" placeholder="Kompensasi turnamen..." />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsPointsModalOpen(false)} className="border-zinc-700 text-zinc-300">Batal</Button>
                                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Terapkan'}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL: ADD/EDIT EARNING METHOD */}
            <Dialog open={isEarningMethodModalOpen} onOpenChange={setIsEarningMethodModalOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedEarningMethod ? 'Edit Cara Mendapat Poin' : 'Tambah Cara Mendapat Poin'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEarningMethodSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul (Contoh: Main Billiard) <span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" required defaultValue={selectedEarningMethod?.title} className="bg-zinc-900 border-zinc-700" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Pilih Ikon</Label>
                            <select name="icon" id="icon" defaultValue={selectedEarningMethod?.icon || 'Clock'} className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                <option value="Clock">Jam Bermain (Clock)</option>
                                <option value="Coffee">Cafe & Resto (Coffee)</option>
                                <option value="ShoppingBag">Transaksi (Shopping Bag)</option>
                                <option value="Gift">Umum (Gift)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi Aturan <span className="text-red-500">*</span></Label>
                            <Textarea id="description" name="description" required defaultValue={selectedEarningMethod?.description} className="bg-zinc-900 border-zinc-700 min-h-[100px]" placeholder="Dapatkan 10 Poin setiap 1 Jam bermain..." />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEarningMethodModalOpen(false)} className="border-zinc-700 text-zinc-300">Batal</Button>
                            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
