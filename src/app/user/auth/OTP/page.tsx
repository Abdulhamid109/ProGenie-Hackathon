'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to handle OTP input changes
  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  // Function to handle OTP verification
  const verifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      toast.error('Please enter a 4-digit OTP.');
      return;
    }
    console.log(otpCode);

    try {
      setLoading(true);
      const response = await axios.post('/api/user/verifyOTP', { otp: otpCode });

      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        router.push('/user/pages/homepage');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.log('Failed to verify OTP: ', error);
      toast.error('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(otp.some((digit) => digit === ''));
  }, [otp]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col items-center justify-center p-4'>
      <Link href={'/'} className="font-semibold top-0 left-0 p-5">ProGenie</Link>

      <div className='text-center text-3xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-fade-in'>
        Verify Your OTP
      </div>
      <div className='flex flex-col items-center justify-center bg-gradient-to-l from-yellow-950/80 to-zinc-800/80 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:shadow-black/70'>
        <h2 className='text-2xl font-semibold text-zinc-100 mb-6'>Enter OTP</h2>
        <div className='flex justify-center space-x-4 mb-6'>
          {otp.map((digit, index) => (
            <input
              key={index}
              type='text'
              maxLength={1}
              className='w-12 h-12 text-center text-xl bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyUp={(e) => {
                if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
                  (document.getElementById(`otp-${index - 1}`) as HTMLInputElement).focus();
                } else if (/^\d$/.test(e.key) && index < 3) {
                  (document.getElementById(`otp-${index + 1}`) as HTMLInputElement).focus();
                }
              }}
              id={`otp-${index}`}
            />
          ))}
        </div>
        <button
          onClick={verifyOTP}
          disabled={buttonDisabled || loading}
          className='w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
}