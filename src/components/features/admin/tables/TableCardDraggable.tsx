"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface TableCardDraggableProps {
    table: { id: string; name: string; type: string; status: string };
    overlay?: boolean;
}

export function TableCardDraggable({ table, overlay }: TableCardDraggableProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: table.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Style based on status for visual cue (prominent left border)
    const statusColor =
        table.status === 'available' ? 'border-l-4 border-l-emerald-500 border-y-white/5 border-r-white/5 text-emerald-100' :
            table.status === 'occupied' ? 'border-l-4 border-l-red-500 border-y-white/5 border-r-white/5 text-red-100' :
                table.status === 'booked' ? 'border-l-4 border-l-amber-500 border-y-white/5 border-r-white/5 text-amber-100' :
                    'border-l-4 border-l-zinc-500 border-y-white/5 border-r-white/5 text-zinc-300';

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-zinc-950/80 backdrop-blur shadow-lg rounded-xl mb-3 cursor-grab active:cursor-grabbing hover:bg-zinc-900 hover:shadow-xl transition-all duration-300 group overflow-hidden",
                statusColor,
                isDragging && "opacity-40 scale-95 shadow-none",
                overlay && "opacity-100 scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50 cursor-grabbing bg-zinc-900 border-white/20 ring-2 ring-emerald-500/30"
            )}
            {...attributes}
            {...listeners}
        >
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-white">{table.name}</h4>
                    <p className="text-xs text-zinc-500 capitalize">{table.type}</p>
                </div>
                <GripVertical className="text-zinc-600 group-hover:text-zinc-400" />
            </CardContent>
        </Card>
    );
}
