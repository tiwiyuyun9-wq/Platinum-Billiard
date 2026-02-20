import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Star } from "lucide-react";

export default function TournamentPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-800 selection:text-white pt-40 pb-20">

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950/80 to-zinc-950 z-0" />

                <div className="container mx-auto relative z-10 px-4 md:px-6 text-center space-y-8">
                    <div className="text-center space-y-6 mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                            Platinum <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">Tournaments</span>
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                            Bersaing dengan yang terbaik. Tunjukkan kemampuan Anda dan menangkan hadiah eksklusif di turnamen billiard premium kami.
                        </p>
                    </div>

                    {/* Placeholder for future tournament list */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-6 text-left hover:border-white/10 transition-all hover:bg-zinc-900/80">
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Star className="w-6 h-6 text-zinc-700 group-hover:text-amber-500" />
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                                        <Trophy className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Kejuaraan Bulanan</h3>
                                        <p className="text-sm text-zinc-500">Segera Hadir</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm text-zinc-400">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> TBA</span>
                                        <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> 32 Slot</span>
                                    </div>
                                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" disabled>
                                        Pendaftaran Ditutup
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
