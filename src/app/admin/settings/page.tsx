"use client";

import { useState, useEffect } from "react";
import { Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function AdminSettingsPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [savedQrisUrl, setSavedQrisUrl] = useState<string | null>(null);

    // Fetch existing settings on load
    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("settings")
                .select("qris_image_url")
                .eq("id", 1)
                .single();

            if (error) {
                console.error("Error fetching settings:", error);
            } else if (data?.qris_image_url) {
                setSavedQrisUrl(data.qris_image_url);
            }
            setIsLoading(false);
        };

        fetchSettings();
    }, [supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        if (!file && !savedQrisUrl) {
            toast.error("Pilih file QRIS terlebih dahulu");
            return;
        }

        setIsSaving(true);

        try {
            let finalImageUrl = savedQrisUrl;

            // 1. Upload new image if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `qris-${Date.now()}.${fileExt}`;
                const filePath = `qris/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('web-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get public URL of newly uploaded image
                const { data: { publicUrl } } = supabase.storage
                    .from('web-assets')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            }

            // 3. Update the settings database
            const { error: updateError } = await supabase
                .from("settings")
                .update({ qris_image_url: finalImageUrl, updated_at: new Date().toISOString() })
                .eq("id", 1);

            if (updateError) throw updateError;

            setSavedQrisUrl(finalImageUrl);
            setFile(null); // Reset file selection after successful save
            toast.success("Pengaturan QRIS berhasil disimpan!");

        } catch (error: unknown) {
            console.error("Save error:", error);
            const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan pengaturan.";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Pengaturan Sistem</h1>
                    <p className="text-sm text-zinc-400 mt-1">Kelola konfigurasi global aplikasi billiard Anda.</p>
                </div>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        Pembayaran QRIS
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Upload gambar QRIS statis yang akan ditampilkan kepada pelanggan saat konfirmasi pembayaran booking meja.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Image Preview Block */}
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden group">
                                {previewUrl || savedQrisUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={previewUrl || savedQrisUrl || ""}
                                            alt="QRIS Preview"
                                            className="w-full h-full object-contain p-4"
                                        />
                                    </>
                                ) : (
                                    <div className="text-zinc-500 flex flex-col items-center p-6 text-center">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                                            Q R
                                        </div>
                                        <p className="text-sm font-medium">Belum ada QRIS</p>
                                        <p className="text-xs mt-1 opacity-70">Upload gambar QR Code untuk menampilkan preview</p>
                                    </div>
                                )}

                                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-200 ${(previewUrl || savedQrisUrl) ? 'group-hover:opacity-100' : ''}`}>
                                    <p className="text-white text-sm font-medium">Preview Saat Ini</p>
                                </div>
                            </div>
                        </div>

                        {/* Upload Controls Block */}
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">File Gambar QRIS</label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleFileChange}
                                        className="bg-zinc-950 border-zinc-700 text-zinc-300 file:text-emerald-500 file:bg-emerald-500/10 file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-1 cursor-pointer hover:border-zinc-500 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Format: JPG, PNG, WEBP. Maksimal ukuran 2MB. Potongan persegi disarankan untuk scan presisi.
                                </p>
                            </div>

                            {file && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
                                    <Upload className="w-4 h-4 text-emerald-500" />
                                    <div className="text-sm text-emerald-400 font-medium truncate">
                                        {file.name} siap di-upload
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 px-6 py-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!file || isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Konfigurasi
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
