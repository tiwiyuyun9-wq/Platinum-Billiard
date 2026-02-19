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

    // Style based on status for visual cue
    const statusColor =
        table.status === 'available' ? 'border-emerald-500/50' :
            table.status === 'occupied' ? 'border-red-500/50' :
                table.status === 'booked' ? 'border-amber-500/50' :
                    'border-zinc-700';

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-zinc-900 mb-3 cursor-grab active:cursor-grabbing hover:border-zinc-500 transition-colors group",
                statusColor,
                isDragging && "opacity-30",
                overlay && "opacity-100 scale-105 shadow-2xl z-50 cursor-grabbing bg-zinc-800 border-white/20"
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
