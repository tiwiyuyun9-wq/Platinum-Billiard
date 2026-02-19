"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { updateProfile } from "@/app/profile/actions"
import { toast } from "sonner"
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { User } from "@supabase/supabase-js"

interface ProfileFormProps {
    user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || "")
    const [fullName, setFullName] = useState(user.user_metadata?.full_name || "")

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsLoading(true)
            const file = event.target.files?.[0]
            if (!file) return

            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('web-assets')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('web-assets')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)
            toast.success("Avatar uploaded successfully!")
        } catch (error) {
            toast.error("Error uploading avatar: " + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        formData.append("avatarUrl", avatarUrl) // Ensure latest avatar URL is sent

        const result = await updateProfile(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Profile updated successfully!")
        }
        setIsLoading(false)
    }

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Informasi Akun</CardTitle>
                <CardDescription className="text-zinc-400">
                    Update detail akun Anda di sini.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20 border-2 border-zinc-700">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="text-xl font-bold bg-zinc-800 text-zinc-400">
                                {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                <Upload className="w-4 h-4 mr-2" />
                                Ganti Foto
                            </Label>
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-zinc-500">Max size 2MB. Format: JPG, PNG, WEBP.</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fullName" className="text-zinc-300">Nama Lengkap</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-emerald-500"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-zinc-300">Email</Label>
                        <div className="p-3 bg-zinc-950/50 rounded-md border border-zinc-800 text-zinc-500 cursor-not-allowed">
                            {user.email}
                        </div>
                        <p className="text-xs text-zinc-600">Email tidak dapat diubah.</p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[120px]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
