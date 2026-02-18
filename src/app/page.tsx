"use client";

import { HeroSection } from "@/components/layout/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      <HeroSection />

      {/* Features Showcase */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kenapa Platinum?</h2>
          <div className="h-1 w-20 bg-zinc-800 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/60 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform border border-zinc-700 shadow-lg">
              <span className="text-2xl">🎱</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Meja Kualitas Turnamen</h3>
            <p className="text-zinc-400 leading-relaxed">
              Kami menggunakan meja standar internasional dengan perawatan rutin untuk akurasi permainan terbaik setiap saat.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/60 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform border border-zinc-700 shadow-lg">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Booking Online Realtime</h3>
            <p className="text-zinc-400 leading-relaxed">
              Cek status meja kosong dari HP Anda. Booking langsung dan datang tanpa perlu menunggu antrian yang membosankan.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/60 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform border border-zinc-700 shadow-lg">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Fasilitas VVIP</h3>
            <p className="text-zinc-400 leading-relaxed">
              Ruangan private dengan fasilitas premium, sofa nyaman, Smart TV, dan layanan prioritas untuk kenyamanan maksimal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
