"use strict";
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // Assuming you have this or use Input type='date'
import { format } from "date-fns";
import { createBooking } from "@/app/reservasi/actions";
import { toast } from "sonner"; // Assuming sonner or generic toast
import { CalendarIcon, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: { id: string; name: string; price: number } | null;
}

export function BookingModal({ isOpen, onClose, table }: BookingModalProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>("19:00");
    const [duration, setDuration] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);

    if (!table) return null;

    const isRasson = table.name.toLowerCase().includes('rasson');
    const hourlyRate = isRasson ? 35000 : 30000; // Simplified estimation for display
    const estimatedPrice = parseInt(duration) * hourlyRate;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('tableId', table!.id);
        formData.append('tableName', table!.name);
        formData.append('date', date ? format(date, 'yyyy-MM-dd') : '');
        formData.append('time', time);
        formData.append('duration', duration);

        const result = await createBooking(formData);

        setIsLoading(false);

        if (result?.error) {
            alert(result.error); // Simple alert for now
        } else {
            alert("Booking Berhasil! Silahkan lanjut ke pembayaran.");
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Booking {table.name}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Pilih jadwal bermain Anda.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">

                    {/* Date Picker */}
                    <div className="grid gap-2">
                        <Label>Tanggal</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="bg-zinc-950 text-white"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Time */}
                        <div className="grid gap-2">
                            <Label>Jam Mulai</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="pl-9 bg-zinc-900 border-zinc-700 text-white"
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="grid gap-2">
                            <Label>Durasi</Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                                    <SelectValue placeholder="Pilih durasi" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                                    <SelectItem value="1">1 Jam</SelectItem>
                                    <SelectItem value="2">2 Jam</SelectItem>
                                    <SelectItem value="3">3 Jam</SelectItem>
                                    <SelectItem value="4">4 Jam</SelectItem>
                                    <SelectItem value="5">5 Jam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Price Estimation */}
                    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Estimasi Total</span>
                        <span className="text-xl font-bold text-emerald-400">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(estimatedPrice)}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                            {isLoading ? "Memproses..." : "Konfirmasi Booking"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
