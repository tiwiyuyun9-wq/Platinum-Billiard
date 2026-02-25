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
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "login" | "register" | "forgot_password";

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
            if (mode === "forgot_password") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                toast.success("Tautan reset password telah dikirim ke email Anda.");
                setMode("login");
            } else if (mode === "login") {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                const user = data.user;
                let isAdmin = false;

                if (user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", user.id)
                        .single();
                    isAdmin = profile?.role === 'admin' || user.email === 'admin@platinumbilliard.com' || user.user_metadata?.role === 'admin';
                }

                toast.success("Berhasil masuk!");
                if (onOpenChange) onOpenChange(false);

                if (isAdmin) {
                    router.push("/admin");
                } else {
                    router.refresh();
                }
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
                toast.success("Registrasi berhasil! Mengalihkan ke dashboard...");
                if (onOpenChange) onOpenChange(false);
                router.push("/profile");
                router.refresh();
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[400px] p-0 bg-zinc-950 border border-white/10 text-zinc-100 overflow-hidden font-sans rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                <div className="p-6 md:p-8 space-y-6 relative z-10">
                    <DialogHeader className="space-y-4">
                        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
                            <div className="bg-gradient-to-br from-zinc-100 to-zinc-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                <span className="text-zinc-950 font-extrabold text-2xl leading-none pt-0.5 font-serif">P</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight leading-none">
                                    Platinum
                                </span>
                                <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-semibold">
                                    Billiard
                                </span>
                            </div>
                        </div>
                        <DialogTitle className="text-xl md:text-2xl font-bold text-center text-white tracking-tight">
                            {mode === "login" ? "Selamat Datang" : mode === "register" ? "Buat Akun Baru" : "Lupa Password"}
                        </DialogTitle>
                        <p className="text-sm text-center text-zinc-400">
                            {mode === "login"
                                ? "Masuk untuk booking meja dan kelola membership."
                                : mode === "register"
                                    ? "Daftar untuk mulai booking meja dengan mudah."
                                    : "Masukkan email Anda untuk menerima tautan reset password."}
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mode === "register" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-zinc-300">Nama Lengkap</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all rounded-xl"
                                            required={mode === "register"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-zinc-300 font-medium">Nomor WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="0812..."
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all rounded-xl"
                                            required={mode === "register"}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300 font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all rounded-xl"
                                required
                            />
                        </div>

                        {mode !== "forgot_password" && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-300 font-medium">Password</Label>
                                    {mode === "login" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("forgot_password");
                                                setError(null);
                                            }}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                        >
                                            Lupa Password?
                                        </button>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all rounded-xl"
                                    required
                                />
                            </div>
                        )}

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-xs text-red-500 bg-red-500/10 rounded overflow-hidden"
                                >
                                    <div className="p-2">{error}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-none mt-4 font-bold rounded-xl h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                mode === "login" ? "Masuk ke Akun" : mode === "register" ? "Daftar Sekarang" : "Kirim Tautan"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-zinc-500 mt-6">
                        {mode === "login" ? "Belum punya akun? " : mode === "register" ? "Sudah punya akun? " : "Kembali ke "}
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "login" ? "register" : "login");
                                setError(null);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold transition-colors"
                        >
                            {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
