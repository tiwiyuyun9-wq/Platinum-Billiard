import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Clock } from "lucide-react";
import Image from "next/image";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";

interface TableCardProps {
  id: string;
  name: string;
  status: TableStatus;
  price: number;
  imageUrl?: string;
  onBook?: (id: string) => void;
}

const statusConfig = {
  available: { label: "Tersedia", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/50" },
  occupied: { label: "Dipakai", color: "bg-red-500/10 text-red-400 border-red-500/30 ring-1 ring-red-500/50" },
  booked: { label: "Dipesan", color: "bg-amber-500/10 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/50" },
  maintenance: { label: "Perbaikan", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 ring-1 ring-zinc-500/50" },
};

export function TableCard({ id, name, status, price, imageUrl, onBook }: TableCardProps) {
  const currentStatus = statusConfig[status];

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/40 hover:border-zinc-100/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group backdrop-blur-sm">
      <div className="relative aspect-video w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale-[0.3] group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
            <span className="text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={cn("backdrop-blur-xl uppercase tracking-widest text-[10px] font-bold px-2 py-1 shadow-lg", currentStatus.color)}>
            {currentStatus.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-5 border-b border-zinc-800/50">
        <CardTitle className="text-lg font-bold text-zinc-100 flex justify-between items-start tracking-tight">
          <span>{name}</span>
          <span className="text-zinc-100 text-lg font-semibold tabular-nums">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)}
            <span className="text-xs text-zinc-500 font-normal ml-1">/jam</span>
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        <div className="flex items-center text-sm text-zinc-400">
          <Users className="w-4 h-4 mr-3 text-zinc-500" />
          <span>Maks. 4 Orang</span>
        </div>
        <div className="flex items-center text-sm text-zinc-400">
          <Clock className="w-4 h-4 mr-3 text-zinc-500" />
          <span>Min. 1 Jam</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold tracking-wide transition-all active:scale-95"
          disabled={status !== 'available'}
          onClick={() => onBook?.(id)}
        >
          {status === 'available' ? 'Booking Table' : 'Tidak Tersedia'}
        </Button>
      </CardFooter>
    </Card>
  );
}
