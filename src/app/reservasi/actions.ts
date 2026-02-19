'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Rates Configuration
const RATES = {
    rasson: { day: 25000, night: 35000 },
    biasa: { day: 20000, night: 30000 }
};

const NIGHT_START_HOUR = 18;

function calculatePrice(tableType: 'rasson' | 'biasa', startTime: Date, durationHours: number): number {
    let totalPrice = 0;
    let currentHour = startTime.getHours();

    for (let i = 0; i < durationHours; i++) {
        // Simple logic: If hour >= 18, use night rate. Else day rate.
        // Adjust logic if "Day" means strictly 11-18. 
        // Assuming operating hours 11:00 - 02:00.
        const isNight = currentHour >= NIGHT_START_HOUR || currentHour < 2;
        const rate = isNight ? RATES[tableType].night : RATES[tableType].day;

        totalPrice += rate;
        currentHour = (currentHour + 1) % 24;
    }

    return totalPrice;
}

export async function createBooking(formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to book." };
    }

    const tableId = formData.get('tableId') as string;
    const tableName = formData.get('tableName') as string;
    const dateStr = formData.get('date') as string; // YYYY-MM-DD
    const timeStr = formData.get('time') as string; // HH:mm
    const duration = parseInt(formData.get('duration') as string);

    if (!tableId || !dateStr || !timeStr || !duration) {
        return { error: "Missing required fields." };
    }

    // Determine Table Type (Simple string check for now)
    const tableType = tableName.toLowerCase().includes('rasson') ? 'rasson' : 'biasa';

    // Parse DateTime
    const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);

    // Calculate Price
    const totalPrice = calculatePrice(tableType, startDateTime, duration);

    // Insert into DB
    const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        table_id: tableId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration_hours: duration,
        total_price: totalPrice,
        status: 'pending_payment'
    });

    if (error) {
        console.error("Booking Error:", error);
        return { error: "Failed to create booking. Please try again." };
    }

    revalidatePath('/reservasi');
    // Redirect to a success/payment page (or just showing a success message)
    // For now, we'll redirect back with a success flag
    return { success: true, message: "Booking Created!" };
}
