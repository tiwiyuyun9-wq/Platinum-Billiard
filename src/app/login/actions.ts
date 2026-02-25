'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for convenience
    // In a real app, you might want to validate this using Zod
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Could not authenticate user')
    }

    const { data: { user } } = await supabase.auth.getUser()
    let isAdmin = false

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        isAdmin = profile?.role === 'admin' || user.email === 'admin@platinumbilliard.com' || user.user_metadata?.role === 'admin'
    }

    revalidatePath('/', 'layout')

    if (isAdmin) {
        redirect('/admin')
    } else {
        redirect('/')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone,
                role: 'customer' // Default role
            }
        }
    })

    if (error) {
        return redirect('/register?error=' + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/profile?message=Registrasi berhasil. Selamat datang!')
}
