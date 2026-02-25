"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";

interface TableData {
    id: string;
    name: string;
    type: string;
    status: TableStatus;
    price: number;
    imageUrl?: string | null;
    image_url?: string | null;
}

interface TableSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table?: TableData | null; // If null, it's add mode. If provided, it's edit mode.
    onSuccess: () => void;
}

export function TableSettingsModal({ open, onOpenChange, table, onSuccess }: TableSettingsModalProps) {
    const isEditMode = !!table;

    const [name, setName] = useState("");
    const [type, setType] = useState("biasa");
    const [status, setStatus] = useState<TableStatus>("available");
    const [price, setPrice] = useState("35000");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const supabase = createClient();

    // Populate form if in edit mode
    useEffect(() => {
        if (open && table) {
            setName(table.name);
            setType(table.type);
            setStatus(table.status || "available");
            setPrice((table.price || 35000).toString());
            setImageFile(null);
            setImagePreview(table.imageUrl || table.image_url || null);
        } else if (open && !table) {
            // Reset for add mode
            setName("");
            setType("biasa");
            setStatus("available");
            setPrice("35000");
            setImageFile(null);
            setImagePreview(null);
        }
    }, [open, table]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `tables/${fileName}`; // Save in tables folder

        const { error: uploadError } = await supabase.storage
            .from('web-assets')
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('web-assets')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Nama meja tidak boleh kosong");
            return;
        }

        const numericPrice = parseInt(price.replace(/\D/g, ''), 10);
        if (isNaN(numericPrice) || numericPrice < 0) {
            toast.error("Harga tidak valid");
            return;
        }

        setIsLoading(true);

        try {
            let finalImageUrl = table?.imageUrl || null;

            // If user uploaded a new image, handle the upload
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }

            const payload = {
                name,
                type,
                status,
                price: numericPrice,
                image_url: finalImageUrl,
            };

            if (isEditMode && table) {
                const { error } = await supabase
                    .from("tables")
                    .update(payload)
                    .eq("id", table.id);

                if (error) throw error;
                toast.success("Meja berhasil diperbarui!");
            } else {
                const { error } = await supabase
                    .from("tables")
                    .insert([payload]);

                if (error) throw error;
                toast.success("Meja baru berhasil ditambahkan!");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
            toast.error(isEditMode ? "Gagal memperbarui meja" : "Gagal menambahkan meja", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Meja' : 'Tambah Meja Baru'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Foto Meja</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 group">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                                        <Upload className="w-5 h-5 mb-1" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <span className="text-xs font-medium text-white">Ganti</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-zinc-400">
                                <p>Rekomendasi rasio 16:9.</p>
                                <p>Maksimal 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Meja</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Meja Rasson 1"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipe Meja</Label>
                            <Select value={type} onValueChange={setType} disabled={isLoading}>
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-white focus:ring-emerald-500">
                                    <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="rasson">Rasson</SelectItem>
                                    <SelectItem value="biasa">Biasa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga per Jam (Rp)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white"
                                disabled={isLoading}
                                required
                                min="0" step="1000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Awal</Label>
                        <Select value={status} onValueChange={(v: TableStatus) => setStatus(v)} disabled={isLoading}>
                            <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-white focus:ring-emerald-500">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="available">Available (Aktif)</SelectItem>
                                <SelectItem value="occupied">Occupied (Dipakai)</SelectItem>
                                <SelectItem value="booked">Booked (Dipesan)</SelectItem>
                                <SelectItem value="maintenance">Maintenance (Rusak)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="text-zinc-400 hover:text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 shadow-lg shadow-emerald-500/20"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah Meja'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
