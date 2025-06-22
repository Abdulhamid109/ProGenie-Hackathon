'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface LoginData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [data, setData] = useState<LoginData>({
        email: "",
        password: "",
    });

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);

    const addLoginData = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setDisable(true);
        try {
            const response = await axios.post("/api/user/login", data);
            if (response.status === 200) {
                setMessage("Successfully Logged in...");
                router.push('/user/pages/homepage');
                toast.success('Successfully logged in...');
            }else if(response.status===400){
                setMessage('Invalid Credentials');
            }else if(response.status===404){
                setMessage('Account does not exists');
            }
        } catch (error) {
            console.log("Failed to Log in", error);
            setError("Something went wrong! Try again.");
        } finally {
            setLoading(false);
            setDisable(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col items-center justify-center p-4'>
            <div className='text-center text-3xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-fade-in'>
                Welcome Back! We&apos;ve Missed You...
            </div>
            <div className='flex flex-col items-center justify-center bg-gradient-to-l from-yellow-950/80 to-zinc-800/80 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:shadow-black/70'>
                <h2 className='text-2xl font-semibold text-zinc-100 mb-6'>Login</h2>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder='Enter your email'
                    className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
                />
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    placeholder='Enter your password'
                    className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
                />
                <button
                    className='w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={addLoginData}
                    disabled={disable}
                >
                    {loading ? "Processing..." : "Login"}
                </button>
                {message && <p className='text-green-400 mt-4 font-medium animate-fade-in'>{message}</p>}
                {error && <p className='text-red-400 mt-4 font-medium animate-fade-in'>{error}</p>}
                <div className='mt-6 text-zinc-300 font-medium'>
                    Don&apos;t have an account? <Link className='text-blue-400 hover:text-blue-300 transition-colors duration-200' href='/user/auth/signup'>Sign Up</Link>
                </div>
                <Link className='text-sm flex justify-end items-end w-full opacity-25 hover:font-semibold' href={'/admin/auth/login'}>Admin</Link>
            </div>
        </div>
    )
}

export default LoginPage