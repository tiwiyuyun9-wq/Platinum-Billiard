"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TableCardDraggable } from "./TableCardDraggable";
import { cn } from "@/lib/utils";

interface ColumnDroppableProps {
    id: string;
    title: string;
    tables: { id: string; name: string; type: string; status: string }[];
}

export function ColumnDroppable({ id, title, tables }: ColumnDroppableProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex flex-col min-h-[500px] transition-all duration-300",
                isOver && "bg-zinc-900/60 border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-300 capitalize">{title}</h3>
                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                    {tables.length}
                </span>
            </div>

            <SortableContext items={tables.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1">
                    {tables.map((table) => (
                        <TableCardDraggable key={table.id} table={table} />
                    ))}
                    {tables.length === 0 && !isOver && (
                        <div className="h-full flex items-center justify-center text-zinc-700 text-sm border-2 border-dashed border-zinc-900 rounded-lg">
                            Kosong
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
