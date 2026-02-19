import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Star } from "lucide-react";

export default function TournamentPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-800 selection:text-white">

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950/80 to-zinc-950 z-0" />

                <div className="container relative z-10 px-4 md:px-6 text-center space-y-8">
                    <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-500 backdrop-blur-xl mb-4">
                        <Trophy className="w-4 h-4 mr-2" />
                        Upcoming Events
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Platinum <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200">Tournaments</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
                        Compete with the best. Show your skills and win exclusive prizes in our regular premium billiard tournaments.
                    </p>

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
                                        <h3 className="text-xl font-bold text-white mb-1">Monthly Championship</h3>
                                        <p className="text-sm text-zinc-500">Coming Soon</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm text-zinc-400">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> TBA</span>
                                        <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> 32 Slots</span>
                                    </div>
                                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700" disabled>
                                        Registration Closed
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
