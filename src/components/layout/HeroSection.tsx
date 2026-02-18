
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-zinc-950">
            {/* Background Gradient - Platinum/Metallic Feel */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 z-0" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] z-0 pointer-events-none" />

            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-100/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 text-center space-y-10 max-w-5xl mx-auto">
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-400 backdrop-blur-xl">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        VVIP Rooms Available Now
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
                        The <span className="bg-gradient-to-r from-zinc-200 via-zinc-500 to-zinc-200 bg-clip-text text-transparent">Platinum</span> Standard<br />
                        of Billiards
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
                        Pengalaman eksklusif bermain billiard dengan meja kualitas turnamen. Booking online, main tanpa antri.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button size="lg" className="h-14 px-10 text-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105" asChild>
                        <Link href="/reservasi">
                            Book Table Now
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white backdrop-blur-sm" asChild>
                        <Link href="/register">
                            Explore Membership
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
