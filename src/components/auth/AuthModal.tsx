"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type AuthMode = "login" | "register";

interface AuthModalProps {
    trigger?: React.ReactNode;
    defaultMode?: AuthMode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function AuthModal({ trigger, defaultMode = "login", open, onOpenChange }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(defaultMode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // Only for register
    const [phone, setPhone] = useState(""); // Only for register

    // Sync mode when defaultMode changes or dialog opens
    useEffect(() => {
        if (open) {
            setMode(defaultMode);
            setError(null);
        }
    }, [defaultMode, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Berhasil masuk!");
                router.refresh();
                if (onOpenChange) onOpenChange(false);
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone,
                        },
                    },
                });
                if (error) throw error;
                toast.success("Registrasi berhasil! Silakan cek email Anda.");
                if (onOpenChange) onOpenChange(false);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setError(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[400px] p-0 bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden font-sans">
                <div className="p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-white">
                            {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
                        </DialogTitle>
                        <p className="text-sm text-center text-zinc-400">
                            {mode === "login"
                                ? "Masuk untuk booking meja dan kelola membership."
                                : "Daftar untuk mulai booking meja dengan mudah."}
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "register" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-zinc-300">Nama Lengkap</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 focus:border-white/20 text-white placeholder:text-zinc-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-zinc-300">Nomor WhatsApp</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="0812..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 focus:border-white/20 text-white placeholder:text-zinc-600"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 focus:border-white/20 text-white placeholder:text-zinc-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 focus:border-white/20 text-white placeholder:text-zinc-600"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-zinc-200 mt-2 font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                mode === "login" ? "Masuk" : "Daftar Sekarang"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-zinc-500">
                        {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-white hover:underline font-medium"
                        >
                            {mode === "login" ? "Daftar" : "Masuk"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
