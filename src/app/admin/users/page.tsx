"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const supabase = createClient();

    useEffect(() => {
        const fetchUsers = async () => {
            // Need to join profiles with memberships if possible, or just profiles
            // Since we can't easily join auth.users, we rely on profiles table
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    *,
                    memberships ( tier, is_active )
                `)
                .order("created_at", { ascending: false })
                .limit(50);

            if (data) setUsers(data);
            setIsLoading(false);
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Users & Member</h1>
                <div className="relative w-[300px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Cari user..."
                        className="pl-9 bg-zinc-900 border-zinc-800 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400">User</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Role</TableHead>
                            <TableHead className="text-zinc-400">Membership</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    {isLoading ? "Memuat data..." : "Tidak ada user ditemukan."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => {
                                const activeMembership = user.memberships?.find((m: any) => m.is_active);
                                return (
                                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-900">
                                        <TableCell className="font-medium text-white flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            {user.full_name}
                                        </TableCell>
                                        <TableCell className="text-zinc-400">{user.email}</TableCell>
                                        <TableCell className="text-zinc-400 capitalize">{user.role || "user"}</TableCell>
                                        <TableCell>
                                            {activeMembership ? (
                                                <Badge variant="outline" className={`
                                                    ${activeMembership.tier === 'platinum' ? 'border-zinc-400 text-zinc-100' :
                                                        activeMembership.tier === 'gold' ? 'border-amber-500 text-amber-500' :
                                                            'border-zinc-600 text-zinc-400'}
                                                `}>
                                                    {activeMembership.tier}
                                                </Badge>
                                            ) : (
                                                <span className="text-zinc-600 text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                Active
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
