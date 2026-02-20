"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TableCardDraggable } from "@/components/features/admin/tables/TableCardDraggable";
import { ColumnDroppable } from "@/components/features/admin/tables/ColumnDroppable";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type TableStatus = "available" | "occupied" | "booked" | "maintenance";

interface Table {
    id: string;
    name: string;
    status: TableStatus;
    type: string;
}

const COLUMNS: { id: TableStatus; title: string }[] = [
    { id: "available", title: "Available" },
    { id: "booked", title: "Booked / Reserved" },
    { id: "occupied", title: "Occupied (Playing)" },
    { id: "maintenance", title: "Maintenance" },
];

export default function TableManagementPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchTables = async () => {
            const { data, error } = await supabase.from("tables").select("*").order("name");
            if (error) {
                toast.error("Gagal memuat data meja");
                return;
            }
            setTables(data as Table[]);
            setIsLoading(false);
        };

        fetchTables();

        // Realtime subscription
        const channel = supabase
            .channel("admin-tables")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tables" },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setTables((prev) =>
                            prev.map((t) => (t.id === payload.new.id ? (payload.new as Table) : t))
                        );
                    } else if (payload.eventType === "INSERT") {
                        setTables((prev) => [...prev, payload.new as Table]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        // const overId = over.id; // Unused for now

        // Find the containers
        const activeTable = tables.find((t) => t.id === activeId);

        if (!activeTable) return;

        // Over a column?
        // const overColumn = COLUMNS.find(c => c.id === overId); // Unused
        // if (overColumn && activeTable.status !== overColumn.id) {
        //     // We'll handle the optimistic update in DragEnd usually or here for visuals
        //     // For simplicity in this V1, let's just allow dropping on column or other items
        // }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTable = tables.find((t) => t.id === activeId);
        if (!activeTable) return;

        const oldStatus = activeTable.status; // Capture old status for revert
        let newStatus: TableStatus | null = null;

        // Dropped over a column directly
        if (COLUMNS.some((c) => c.id === overId)) {
            newStatus = overId as TableStatus;
        }
        // Dropped over another table? Find its status
        else {
            const overTable = tables.find((t) => t.id === overId);
            if (overTable) {
                newStatus = overTable.status;
            }
        }

        if (newStatus && newStatus !== oldStatus) {
            // Optimistic Update
            setTables((prev) =>
                prev.map((t) =>
                    t.id === activeId ? { ...t, status: newStatus! } : t
                )
            );

            // Supabase Update
            const { error } = await supabase
                .from("tables")
                .update({ status: newStatus })
                .eq("id", activeId);

            if (error) {
                toast.error("Gagal update status meja");
                // Revert locally
                setTables((prev) =>
                    prev.map((t) =>
                        t.id === activeId ? { ...t, status: oldStatus } : t
                    )
                );
            } else {
                toast.success(`Meja dipindah ke ${newStatus}`);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                    Manajemen <span className="text-emerald-500">Meja</span>
                </h1>
                <p className="text-zinc-400 text-lg font-light">Atur status ketersediaan meja dengan drag & drop secara realtime.</p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {COLUMNS.map((col) => (
                        <ColumnDroppable
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            tables={tables.filter((t) => t.status === col.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <TableCardDraggable table={tables.find((t) => t.id === activeId)!} overlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
