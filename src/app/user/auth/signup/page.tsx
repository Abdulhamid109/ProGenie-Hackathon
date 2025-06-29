'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface SignupData {
    name: string;
    email: string;
    password: string;
}

const Signup = () => {
    const [data, setData] = useState<SignupData>({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);

    const validateForm = () => {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
        } = {};

        // Name validation
        if (!data.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(data.name)) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        // Email validation
        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = "Invalid email format";
        }

        // Password validation
        if (!data.password) {
            newErrors.password = "Password is required";
        } else if (data.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addSignupData = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setDisable(true);
        setError(null); // Clear previous errors
        setMessage(null); // Clear previous messages

        try {
            const response = await axios.post("/api/user/signin", data);
            console.log('Response:', response.data);
            console.log('Response status:', response.status);

            if (response.status === 200) {
                setMessage("'Redirecting to OTP verification");
                setTimeout(() => {
                    router.push(`/user/auth/OTP?email=${data.email}`);
                }, 1500);
            } else if (response.status === 400) {
                setMessage("This email already exists")
            } else {
                setMessage('Something went wrong!!!')
            }

        } catch (error) {
            console.error("Signup failed:", error);

            setError("Something went wrong. Please try again.");


        } finally {
            setLoading(false);
            setDisable(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col items-center justify-center p-4'>
            <Link href={'/'} className="font-semibold top-0 left-0 p-5">ProGenie</Link>

            <div className='text-center text-3xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-fade-in'>
                Welcome!! Good to have You...
            </div>
            <div className='flex flex-col items-center justify-center bg-gradient-to-l from-yellow-950/80 to-zinc-800/80 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:shadow-black/70'>
                <h2 className='text-2xl font-semibold text-zinc-100 mb-6'>Sign Up</h2>
                <form onSubmit={addSignupData}>
                    <div className='mb-4'>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            placeholder='Enter your name'
                            className={`w-full p-3 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'} placeholder-zinc-400 transition-all duration-200`}
                        />
                        {errors.name && <p className='text-red-400 text-sm mt-1 font-medium'>{errors.name}</p>}
                    </div>
                    <div className='mb-4'>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder='Enter your email'
                            className={`w-full p-3 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'} placeholder-zinc-400 transition-all duration-200`}
                        />
                        {errors.email && <p className='text-red-400 text-sm mt-1 font-medium'>{errors.email}</p>}
                    </div>
                    <div className='mb-4'>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            placeholder='Enter your password'
                            className={`w-full p-3 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'} placeholder-zinc-400 transition-all duration-200`}
                        />
                        {errors.password && <p className='text-red-400 text-sm mt-1 font-medium'>{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className='w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={disable}
                    >
                        {loading ? "Processing..." : "Sign Up"}
                    </button>
                </form>
                {message && <p className='text-green-400 mt-4 font-medium animate-fade-in'>{message}</p>}
                {error && <p className='text-red-400 mt-4 font-medium animate-fade-in'>{error}</p>}
                <div className='mt-6 text-zinc-300 font-medium'>
                    Already have an account? <Link className='text-blue-400 hover:text-blue-300 transition-colors duration-200' href='/user/auth/login'>Login</Link>
                </div>
            </div>
            <Link className='text-sm flex justify-end items-end w-full opacity-25 hover:font-semibold' href={'/admin/auth/login'}>Admin</Link>
        </div>
    )
}

export default Signup