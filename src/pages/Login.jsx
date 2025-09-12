import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ✅ Yo'lni loyihangga moslashtir:
import { loginThunk } from "../features/auth/authThunks";
const selectStatus = (s) => s.auth?.status;
const selectError = (s) => s.auth?.error;
const selectUser = (s) => s.auth?.user || null;

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const status = useSelector(selectStatus);
    const error = useSelector(selectError);
    const user = useSelector(selectUser);

    const [form, setForm] = useState({ email: "", password: "", remember: true });
    const [showPass, setShowPass] = useState(false);

    // Agar allaqachon login bo'lgan bo'lsa, kirish sahifasidan chiqaramiz
    useEffect(() => {
        if (user) {
            const to = state?.from?.pathname || "/";
            navigate(to, { replace: true });
        }
    }, [user, state?.from?.pathname, navigate]);

    const onChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const isLoading = status === "loading";
    const isValid = useMemo(() => {
        return form.email.trim().length > 4 && form.password.trim().length >= 4;
    }, [form.email, form.password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || isLoading) return;

        const res = await dispatch(loginThunk({ email: form.email.trim(), password: form.password }));
        if (res?.meta?.requestStatus === "fulfilled") {
            const to = state?.from?.pathname || "/";
            navigate(to, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
            {/* Mars Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-500 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Stars */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes slow-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 60s linear infinite;
                }
            `}</style>

            <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl shadow-2xl border border-red-500/30 rounded-2xl p-8">
                    {/* Game Logo/Title */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            MARS.IO
                        </h2>
                        <p className="text-gray-300 text-sm mt-2">Conquer the Red Planet</p>
                    </div>

                    {error && (
                        <div className="alert bg-red-900/50 border border-red-500/50 text-red-200 text-sm mb-4">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{String(error)}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white placeholder-gray-400 transition-all"
                                placeholder="commander@mars.io"
                                value={form.email}
                                onChange={onChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Parol
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white placeholder-gray-400 transition-all"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={onChange}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setShowPass((s) => !s)}
                                >
                                    {showPass ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                            <label htmlFor="remember" className="flex items-center gap-3 cursor-pointer">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-2 focus:ring-red-500/20"
                                    checked={form.remember}
                                    onChange={onChange}
                                />
                                <span className="text-gray-200 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                                    </svg>
                                    Remember Commander
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white font-bold shadow-lg transition-all duration-300 ${
                                isLoading ? "opacity-70" : ""
                            } ${!isValid || isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-red-500/25 hover:scale-[1.02]"}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Launching...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Launch Mission
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-700"></div>
                        <span className="px-4 text-gray-400 text-sm">OR</span>
                        <div className="flex-1 border-t border-gray-700"></div>
                    </div>

                    <p className="text-sm text-center text-gray-300">
                        New to Mars?{" "}
                        <Link className="text-red-400 hover:text-red-300 font-medium underline-offset-2 hover:underline transition-all" to="/register">
                            Join the Colony
                        </Link>
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-20 pointer-events-none">
                        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}