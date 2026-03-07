'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"


export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const fullName = formData.get("fullName") as string
    const avatarUrl = formData.get("avatarUrl") as string

    if (!fullName) {
        return { error: "Name is required" }
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            avatar_url: avatarUrl || undefined,
        }
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function cancelBooking(bookingId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Anda harus login untuk membatalkan booking." };
    }

    // Verify booking belongs to user and is pending or waiting
    const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !booking) {
        return { error: "Booking tidak ditemukan." };
    }

    if (booking.status !== 'pending_payment' && booking.status !== 'waiting_confirmation') {
        return { error: "Hanya booking yang belum dikonfirmasi yang dapat dibatalkan." };
    }

    const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

    if (updateError) {
        console.error("Error cancelling booking:", updateError);
        return { error: "Gagal membatalkan booking." };
    }

    revalidatePath('/profile');
    revalidatePath('/admin/tables'); // So tables show available again
    return { success: true };
}
