import { Hammer } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Hammer className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {title}
                </h1>
                <p className="text-lg text-zinc-400">
                    Fitur ini sedang dalam tahap pengembangan. Kami tidak sabar untuk segera menghadirkannya untuk Anda!
                </p>
                <div className="pt-8">
                    <div className="inline-flex items-center justify-center px-6 py-3 border border-zinc-800 rounded-full bg-zinc-900/50 text-sm font-medium text-zinc-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                        Segera Hadir
                    </div>
                </div>
            </div>
        </div>
    );
}
