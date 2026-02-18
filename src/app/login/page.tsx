import Link from "next/link";
import { Button } from "@/components/ui/button";
import { login } from "./actions";

export default function LoginPage({
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
                    Masuk ke Akun Anda
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Atau{" "}
                    <Link href="/register" className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
                        daftar member baru
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-900/50 py-8 px-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 sm:rounded-2xl sm:px-10 backdrop-blur-sm">
                    <form className="space-y-6" action={login}>

                        {searchParams.error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                                {searchParams.error}
                            </div>
                        )}

                        {searchParams.message && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm text-center">
                                {searchParams.message}
                            </div>
                        )}

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
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-zinc-700 rounded bg-zinc-900"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-zinc-400 hover:text-white transition-colors">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-6 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-zinc-950 bg-zinc-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all hover:scale-[1.02]"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
