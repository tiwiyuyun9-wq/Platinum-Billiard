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
import { ArrowDownLeft, Clock, Info, Coffee, ShoppingBag, Gift } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PointsInfoModal({ methods = [] }: { methods?: any[] }) {

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'Clock': return <Clock className="w-6 h-6 text-emerald-500" />;
            case 'Coffee': return <Coffee className="w-6 h-6 text-emerald-500" />;
            case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-emerald-500" />;
            default: return <Gift className="w-6 h-6 text-emerald-500" />;
        }
    };

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

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {methods.length === 0 ? (
                        <p className="text-zinc-500 text-center">Belum ada informasi cara mendapatkan poin.</p>
                    ) : (
                        methods.map((method) => (
                            <div key={method.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800/50">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center shrink-0 justify-center border border-emerald-500/20">
                                    {renderIcon(method.icon)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{method.title}</h4>
                                    <p className="text-zinc-400 text-sm whitespace-pre-wrap">
                                        {method.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

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
