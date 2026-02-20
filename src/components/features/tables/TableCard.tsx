import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";

interface TableCardProps {
  id: string;
  name: string;
  status: TableStatus;
  price: number;
  imageUrl?: string;
  timePlayedStart?: string; // ISO string of when they started playing
  bookedUntil?: string;
  onBook?: (id: string) => void;
}

const statusConfig = {
  available: {
    label: "Tersedia",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    border: "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    gradient: "from-emerald-500/20",
    button: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all border-none",
    buttonText: "Booking Table"
  },
  occupied: {
    label: "Dipakai",
    color: "bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    border: "border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]",
    gradient: "from-red-500/20",
    button: "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 cursor-not-allowed",
    buttonText: "Sedang Dipakai"
  },
  booked: {
    label: "Dipesan",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    border: "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    gradient: "from-amber-500/20",
    button: "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 cursor-not-allowed",
    buttonText: "Telah Dipesan"
  },
  maintenance: {
    label: "Perbaikan",
    color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/50 shadow-[0_0_15px_rgba(113,113,122,0.2)]",
    border: "border-zinc-700/50 hover:border-zinc-500/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
    gradient: "from-zinc-500/20",
    button: "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 cursor-not-allowed",
    buttonText: "Perbaikan"
  },
};

export function TableCard({ id, name, status, price, imageUrl, timePlayedStart, bookedUntil, onBook }: TableCardProps) {
  const currentStatus = statusConfig[status];

  // Live timer logic
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    if (!timePlayedStart || status !== 'occupied') {
      setElapsedTime("");
      return;
    }

    const startTime = new Date(timePlayedStart).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = now - startTime;

      if (diff < 0) {
        setElapsedTime("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formattedParts = [];
      if (hours > 0) formattedParts.push(hours.toString().padStart(2, '0'));
      formattedParts.push(minutes.toString().padStart(2, '0'));
      formattedParts.push(seconds.toString().padStart(2, '0'));

      setElapsedTime(formattedParts.join(':'));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timePlayedStart, status]);

  return (
    <Card className={cn(
      "overflow-hidden bg-zinc-950 transition-all duration-500 group backdrop-blur-md flex flex-col h-full p-0 gap-0 border",
      currentStatus.border
    )}>
      <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-zinc-950">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              unoptimized
              className={cn(
                "object-cover transition-transform duration-700 group-hover:scale-105",
                status === 'available' ? "opacity-90 group-hover:opacity-100" : "opacity-50 grayscale-[0.6] group-hover:grayscale-[0.4]"
              )}
            />
            {/* Dynamic Status Glow Overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 z-10 mix-blend-overlay", currentStatus.gradient)} />
          </>
        ) : (
          <div className="w-full h-full bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-600 border-b border-white/5">
            <Clock className="w-8 h-8 mb-2 opacity-20" />
            <span className="text-sm font-medium">Belum ada foto</span>
          </div>
        )}

        {/* Subtle inner ring and bottom shadow for depth */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent z-10 pointer-events-none" />

        <div className="absolute top-4 right-4 z-30">
          <Badge variant="outline" className={cn("backdrop-blur-xl uppercase tracking-widest text-[9px] sm:text-[10px] font-bold px-3 py-1.5 border", currentStatus.color)}>
            {currentStatus.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-4 border-t border-b border-white/5 relative z-20 bg-zinc-900/30">
        <CardTitle className="flex justify-between items-start tracking-tight gap-4">
          <span className="text-lg sm:text-xl font-extrabold text-white leading-tight">{name}</span>
          <div className="flex flex-col items-end leading-none space-y-1.5 shrink-0">
            <span className="text-zinc-100 text-lg font-bold tabular-nums">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)}
            </span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">per jam</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-end bg-gradient-to-b from-transparent to-zinc-900/20 relative">
        {/* Subtle inner glow matching status */}
        <div className={cn("absolute inset-0 opacity-10 pointer-events-none mix-blend-screen", currentStatus.gradient)} />

        <div className="relative z-10 w-full">
          {status === 'available' ? (
            <div className="flex items-center text-sm text-emerald-400/90 font-medium bg-emerald-500/10 px-4 py-3 rounded-lg border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              Meja siap untuk dipesan
            </div>
          ) : status === 'maintenance' ? (
            <div className="flex items-center text-sm text-zinc-400 font-medium bg-zinc-800/50 px-4 py-3 rounded-lg border border-zinc-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 mr-3"></div>
              Sedang dalam perbaikan rutin
            </div>
          ) : (
            <div className="space-y-2.5">
              {timePlayedStart && elapsedTime && (
                <div className="flex items-center justify-between text-sm text-amber-400 font-medium bg-amber-500/10 px-4 py-3 rounded-lg border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2.5 animate-pulse opacity-80" />
                    <span>Playtime</span>
                  </div>
                  <span className="font-mono tabular-nums tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded text-xs">{elapsedTime}</span>
                </div>
              )}
              {bookedUntil && (
                <div className="flex items-center justify-between text-sm text-zinc-300 bg-zinc-800/40 px-4 py-3 rounded-lg border border-white/5">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2.5 text-zinc-500" />
                    <span className="text-zinc-400">Selesai</span>
                  </div>
                  <span className="font-medium bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-300">{bookedUntil}</span>
                </div>
              )}
              {!timePlayedStart && !bookedUntil && (
                <div className="flex items-center text-sm text-zinc-500 italic bg-zinc-800/20 px-4 py-3 rounded-lg border border-white/5">
                  Informasi sesi tidak tersedia
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0 sm:pt-0 bg-zinc-900/20 relative z-10">
        <Button
          className={cn("w-full font-bold tracking-widest uppercase text-xs h-12", currentStatus.button)}
          disabled={status !== 'available'}
          onClick={() => onBook?.(id)}
        >
          {currentStatus.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
