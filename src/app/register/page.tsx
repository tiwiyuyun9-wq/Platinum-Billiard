import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signup } from "../login/actions";

export default function RegisterPage({
    searchParams,
}: {
    searchParams: { message: string; error: string };
}) {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-zinc-100 to-zinc-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-500/20">
                        <span className="text-zinc-950 font-bold text-2xl leading-none pt-1">P</span>
                    </div>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Daftar Member Baru
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
                        Masuk disini
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-900/50 py-8 px-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 sm:rounded-2xl sm:px-10 backdrop-blur-sm">
                    <form className="space-y-6" action={signup}>

                        {searchParams.error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                                {searchParams.error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300">
                                Nama Lengkap
                            </label>
                            <div className="mt-1">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
                                Nomor WhatsApp
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-6 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-zinc-950 bg-zinc-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all hover:scale-[1.02]"
                            >
                                Daftar Member
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
