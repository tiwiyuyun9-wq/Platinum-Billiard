"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDownLeft, Clock, Info } from "lucide-react";

export function PointsInfoModal() {
    return (
        <Dialog modal={false}>
            <DialogTrigger asChild>
                <Button className="bg-white text-orange-600 hover:bg-zinc-100 font-bold border-0 shadow-lg transition-transform active:scale-95">
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Cara Dapat Poin
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Info className="w-5 h-5 text-amber-500" />
                        Cara Mendapatkan Poin
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Kumpulkan poin sebanyak-banyaknya dan tukarkan dengan hadiah menarik!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/50">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Clock className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Main Billiard</h4>
                            <p className="text-zinc-400 text-sm">
                                Dapatkan <span className="text-amber-400 font-bold">10 Poin</span> setiap 1 Jam bermain.
                            </p>
                        </div>
                    </div>

                    <div className="text-sm text-center text-zinc-500 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/30">
                        *Poin akan masuk otomatis setelah booking selesai (status Completed).
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white" asChild>
                        {/* Radix Dialog Close is handled automatically by clicking outside or escape, 
                            but we can add a visual close button if needed. 
                            For now, let's keep it simple. */}
                        <button type="button">Tutup</button>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
