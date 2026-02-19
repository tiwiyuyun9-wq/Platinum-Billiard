'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
