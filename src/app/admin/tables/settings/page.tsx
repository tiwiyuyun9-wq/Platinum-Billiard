"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { TableSettingsModal } from "@/components/features/admin/tables/TableSettingsModal";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";

interface TableData {
    id: string;
    name: string;
    type: string;
    status: TableStatus;
    price: number;
    image_url: string | null;
}

export default function TableSettingsPage() {
    const [tables, setTables] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const { data, error } = await supabase
                .from("tables")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            setTables(data || []);
        } catch (error: any) {
            toast.error("Gagal memuat data meja", {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setSelectedTable(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (table: TableData) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus meja "${name}"? Data yang sudah dihapus tidak dapat dikembalikan.`)) return;

        try {
            const { error } = await supabase
                .from("tables")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Meja berhasil dihapus!");
            fetchTables();
        } catch (error: any) {
            toast.error("Gagal menghapus meja", {
                description: error.message
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">Daftar Meja</h2>
                    <p className="text-sm text-zinc-400">Atur tarif, gambar, dan nama meja.</p>
                </div>
                <Button
                    onClick={handleOpenAddModal}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Meja
                </Button>
            </div>

            <Card className="bg-zinc-900/50 border-white/5 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Gambar</th>
                                <th className="px-6 py-4 font-medium">Nama Meja</th>
                                <th className="px-6 py-4 font-medium">Tipe</th>
                                <th className="px-6 py-4 font-medium">Harga / Jam</th>
                                <th className="px-6 py-4 font-medium">Status Data</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tables.map((table) => (
                                <tr key={table.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-zinc-950">
                                            {table.image_url ? (
                                                <Image
                                                    src={table.image_url}
                                                    alt={table.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">{table.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-zinc-300 capitalize">{table.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                                            <span>Rp</span>
                                            <span>{table.price ? table.price.toLocaleString("id-ID") : "35.000"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {table.status === 'maintenance' ? (
                                            <Badge variant="outline" className="text-red-400 border-red-400/20 bg-red-400/10">Maintenance</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Aktif</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleOpenEditModal(table)}
                                            className="h-8 w-8 bg-zinc-950 border-white/10 hover:bg-zinc-800 hover:text-white"
                                        >
                                            <Pencil className="w-4 h-4 text-blue-400" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(table.id, table.name)}
                                            className="h-8 w-8 bg-zinc-950 border-white/10 hover:bg-zinc-800 hover:text-white"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {tables.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        Belum ada data meja. Klik "Tambah Meja" untuk memulai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <TableSettingsModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                table={selectedTable}
                onSuccess={fetchTables}
            />
        </div>
    );
}
