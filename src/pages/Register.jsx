// src/pages/Register.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../features/auth/authThunks";
import { selectAuthStatus, selectAuthError } from "../features/auth/authSelectors";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);

    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(registerThunk(form));
        if (res.meta.requestStatus === "fulfilled") {
            navigate("/", { replace: true });
        }
    };

    const isLoading = status === "loading";
    const isValid = form.username.trim().length > 2 && 
                   form.email.trim().length > 4 && 
                   form.password.trim().length >= 4;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const marsOrbitVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 100,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
            {/* Animated Mars Background */}
            <motion.div 
                className="absolute inset-0 opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
            >
                <motion.div 
                    className="absolute top-20 right-20 w-40 h-40 bg-red-500 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-32 left-32 w-48 h-48 bg-orange-400 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div 
                    className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-500 rounded-full blur-2xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />
            </motion.div>

            {/* Animated Stars */}
            <div className="absolute inset-0">
                {[...Array(60)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Mars Orbit Animation */}
            <motion.div 
                className="absolute top-1/2 left-1/2 w-96 h-96 border border-red-500/10 rounded-full"
                style={{ transform: "translate(-50%, -50%)" }}
                variants={marsOrbitVariants}
                animate="animate"
            />

            <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    className="w-full max-w-md bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl shadow-2xl border border-red-500/30 rounded-2xl p-8 relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }}
                >
                    {/* Floating Mars Icon */}
                    <motion.div 
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2"
                        variants={floatingVariants}
                        animate="animate"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 relative">
                            {/* Mars Surface Pattern */}
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute top-3 left-4 w-4 h-4 bg-red-700/30 rounded-full"></div>
                                <div className="absolute bottom-5 right-3 w-6 h-6 bg-red-800/20 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-orange-700/20 rounded-full"></div>
                            </div>
                            {/* Mars Ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-orange-300/20 animate-pulse"></div>
                            {/* Icon */}
                            <svg className="w-10 h-10 text-white z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-8"
                    >
                        {/* Title */}
                        <motion.div variants={itemVariants} className="text-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                Join MARS.IO
                            </h2>
                            <p className="text-gray-300 text-sm mt-2">Begin Your Martian Adventure</p>
                        </motion.div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="alert bg-red-900/50 border border-red-500/50 text-red-200 text-sm mb-4 rounded-lg p-3"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{String(error)}</span>
                            </motion.div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-5">
                            {/* Username Input */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="username" className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Commander Name
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    id="username"
                                    name="username"
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white placeholder-gray-400 transition-all"
                                    placeholder="Enter your callsign"
                                    value={form.username}
                                    onChange={onChange}
                                    autoComplete="username"
                                    required
                                />
                            </motion.div>

                            {/* Email Input */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="email" className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Mission Email
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
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
                            </motion.div>

                            {/* Password Input */}
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label htmlFor="password" className="flex items-center gap-2 text-gray-200 font-medium text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Security Code
                                </label>
                                <div className="relative">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        id="password"
                                        name="password"
                                        type={showPass ? "text" : "password"}
                                        className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white placeholder-gray-400 transition-all"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={onChange}
                                        autoComplete="new-password"
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
                            </motion.div>

                            {/* Terms & Conditions */}
                            <motion.div 
                                variants={itemVariants} 
                                className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50"
                            >
                                <p className="text-xs text-gray-400">
                                    By creating an account, you agree to explore the Red Planet responsibly and follow the 
                                    <span className="text-red-400"> Martian Colony Guidelines</span>.
                                </p>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!isValid || isLoading}
                                className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg text-white font-bold shadow-lg transition-all duration-300 ${
                                    isLoading ? "opacity-70" : ""
                                } ${!isValid || isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-red-500/25"}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Initializing Colony...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                                        </svg>
                                        Join the Colony
                                    </div>
                                )}
                            </motion.button>
                        </form>

                        <motion.div variants={itemVariants} className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-700"></div>
                            <span className="px-4 text-gray-400 text-sm">OR</span>
                            <div className="flex-1 border-t border-gray-700"></div>
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-sm text-center text-gray-300">
                            Already a colonist?{" "}
                            <Link 
                                className="text-red-400 hover:text-red-300 font-medium underline-offset-2 hover:underline transition-all" 
                                to="/login"
                            >
                                Return to Base
                            </Link>
                        </motion.p>
                    </motion.div>

                    {/* Decorative Mars Satellites */}
                    <motion.div 
                        className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-60"
                        animate={{
                            rotate: 360,
                            x: [0, 10, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div 
                        className="absolute -bottom-2 -left-2 w-3 h-3 bg-gray-500 rounded-full opacity-50"
                        animate={{
                            rotate: -360,
                            x: [0, -8, 0],
                            y: [0, 8, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}