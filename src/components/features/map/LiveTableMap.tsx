"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableCard } from "@/components/features/tables/TableCard"; // Reusing card or creating a pin
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";
type TableType = "rasson" | "standard";

interface Table {
    id: string;
    name: string;
    type: TableType;
    status: TableStatus;
    position_x: number;
    position_y: number;
    rotation: number;
}

export function LiveTableMap() {
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Initial Fetch
        const fetchTables = async () => {
            const { data } = await supabase.from("tables").select("*").order("id");
            if (data) setTables(data);
            setIsLoading(false);
        };

        fetchTables();

        // Realtime Subscription
        const channel = supabase
            .channel("live-tables")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tables" },
                (payload) => {
                    console.log("Change received!", payload);
                    if (payload.eventType === "INSERT") {
                        setTables((prev) => [...prev, payload.new as Table]);
                    } else if (payload.eventType === "UPDATE") {
                        setTables((prev) =>
                            prev.map((t) => (t.id === payload.new.id ? (payload.new as Table) : t))
                        );
                    } else if (payload.eventType === "DELETE") {
                        setTables((prev) => prev.filter((t) => t.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Background Grid/Floor Plan (Placeholder) */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Entrance Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950 px-4 py-1 rounded-full border border-zinc-800 text-xs text-zinc-500 uppercase tracking-widest font-bold">
                Entrance
            </div>

            {tables.map((table) => (
                <div
                    key={table.id}
                    className="absolute transition-all duration-500 ease-in-out cursor-pointer group"
                    style={{
                        left: `${table.position_x}%`,
                        top: `${table.position_y}%`,
                        transform: `translate(-50%, -50%) rotate(${table.rotation}deg)`,
                    }}
                >
                    {/* Table Shape */}
                    <div className={cn(
                        "w-24 h-14 rounded-md flex items-center justify-center shadow-lg border-2 transition-colors relative",
                        table.type === 'rasson' ? 'w-32 h-16' : 'w-24 h-14', // Rasson larger
                        table.status === 'available' ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/40 hover:border-emerald-400' :
                            table.status === 'occupied' ? 'bg-red-900/20 border-red-500/50' :
                                table.status === 'booked' ? 'bg-amber-900/20 border-amber-500/50' :
                                    'bg-zinc-800 border-zinc-700'
                    )}>
                        {/* Status Indicator Dot */}
                        <div className={cn(
                            "absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-zinc-950 shadow-sm",
                            table.status === 'available' ? 'bg-emerald-500 animate-pulse' :
                                table.status === 'occupied' ? 'bg-red-500' :
                                    table.status === 'booked' ? 'bg-amber-500' : 'bg-zinc-500'
                        )} />

                        <span className="text-xs font-bold text-white/80 select-none">
                            {table.id}
                        </span>

                        {/* Tooltip on Hover */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-32 text-center">
                            <p className="text-xs font-bold text-white">{table.name}</p>
                            <p className={cn("text-[10px] uppercase font-bold",
                                table.status === 'available' ? 'text-emerald-400' :
                                    table.status === 'occupied' ? 'text-red-400' :
                                        table.status === 'booked' ? 'text-amber-400' : 'text-zinc-500'
                            )}>{table.status}</p>
                            {table.status === 'available' && <p className="text-[10px] text-zinc-500 mt-1">Klik untuk Booking</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
