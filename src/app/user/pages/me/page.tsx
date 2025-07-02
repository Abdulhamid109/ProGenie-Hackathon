"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

// Interface definitions
interface Personal {
    name: string;
    email: string;
}

interface ProfileData {
    gender: string;
    location: string;
    DOB: string;
    CourseName: string;
    Spealization: string;
    ColleageName: string;
    GradingSystem: string;
    Score: string;
    StartYear: string;
    EndYear: string;
    Type: string;
    phoneno: string;
}

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-zinc-600 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-zinc-600 rounded w-2/3"></div>
    </div>
);

const DetailsSkeleton = () => (
    <div className="animate-pulse space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex space-x-2">
                <div className="h-4 bg-zinc-600 rounded w-24"></div>
                <div className="h-4 bg-zinc-600 rounded w-32"></div>
            </div>
        ))}
    </div>
);

export default function MePage() {
    // State management
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [resumeLoading, setResumeLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    
    const [personal, setPersonal] = useState<Personal>({
        name: "",
        email: ""
    });
    
    const [data, setData] = useState<ProfileData>({
        gender: "",
        DOB: "",
        location: "",
        CourseName: "",
        Spealization: "",
        ColleageName: "",
        GradingSystem: "",
        Score: "",
        StartYear: "",
        EndYear: "",
        Type: "",
        phoneno: "",
    });
    
    const [resume, setResume] = useState<string>('');

    // Fetch user profile data
    const fetchUserDetails = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        
        try {
            // Fetch user details and resume in parallel
            const [userResponse, resumeResponse] = await Promise.all([
                axios.get('/api/user/me'),
                axios.get('/api/user/resume')
            ]);

            // Handle user details response
            if (userResponse.status === 200) {
                setPersonal(userResponse.data.personal);
                setData(userResponse.data.me);
                console.log("Basic Data:", userResponse.data.personal.name);
                console.log("ProfilePage Data:", userResponse.data.me);
            } else {
                throw new Error(userResponse.data.error || 'Failed to fetch user details');
            }

            // Handle resume response
            if (resumeResponse.status === 200) {
                const resumeUrl = resumeResponse.data.resume;
                setResume(resumeUrl);
                console.log('Resume URL:', resumeUrl);
            } else {
                console.warn('Failed to fetch resume link');
                // Don't throw error for resume failure, just log it
            }

            setMessage('Profile loaded successfully');
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            setError(
                'Failed to fetch user details. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle resume link click with loading state
    const handleResumeClick = async (e: React.MouseEvent) => {
        if (!resume) {
            e.preventDefault();
            setResumeLoading(true);
            
            try {
                const resumeResponse = await axios.get('/api/user/resume');
                if (resumeResponse.status === 200) {
                    const resumeUrl = resumeResponse.data.resume;
                    setResume(resumeUrl);
                    // Open the resume in a new tab
                    window.open(resumeUrl, '_blank');
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
                setError('Failed to load resume. Please try again.');
            } finally {
                setResumeLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    // Error state
    if (error && !loading) {
        return (
            <div className="p-10 flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl max-w-md">
                    <h3 className="font-bold text-lg mb-2">Error</h3>
                    <p className="mb-4">{error}</p>
                    <Button 
                        onClick={fetchUserDetails}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Retrying...' : 'Retry'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="p-10 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Please wait, your details are being fetched...</p>
                </div>
            </div>
        }>
            <div className="p-10 max-w-4xl mx-auto">
                {/* Success message */}
                {message && !loading && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
                        {message}
                    </div>
                )}

                {/* Basic Details Container */}
                <div className="p-6 bg-zinc-700 rounded-xl shadow-lg shadow-zinc-500 mb-8">
                    <h2 className="underline text-2xl font-bold text-white mb-4">
                        Basic Details
                    </h2>
                    
                    <div className="space-y-3">
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-16">Name:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {personal.name || 'Not provided'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-16">Email:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {personal.email || 'Not provided'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Professional Details Container */}
                <div className="p-6 bg-zinc-700 rounded-xl shadow-lg shadow-zinc-500 mb-8">
                    <h2 className="underline text-2xl font-bold text-white mb-4">
                        Professional Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {loading ? (
                            <div className="col-span-full">
                                <DetailsSkeleton />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Gender:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.gender || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Location:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.location || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Date of Birth:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.DOB || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Phone:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.phoneno || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Course Name:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.CourseName || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Specialization:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.Spealization || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">College Name:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.ColleageName || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Grading System:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.GradingSystem || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Score:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.Score || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Start Year:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.StartYear || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">End Year:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.EndYear || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-zinc-300 min-w-32">Student Type:</span>
                                    <span className="font-light tracking-tight text-white">
                                        {data.Type || 'Not specified'}
                                    </span>
                                </div>
                                
                                {/* Resume Link */}
                                <div className="col-span-full mt-4 pt-4 border-t border-zinc-600">
                                    {resume ? (
                                        <Link 
                                            href={resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                            <span className="font-semibold">📄 Resume:</span>
                                            <span className="underline">Click to open resume</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleResumeClick}
                                            disabled={resumeLoading}
                                            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            <span className="font-semibold">📄 Resume:</span>
                                            <span className="underline">
                                                {resumeLoading ? 'Loading resume...' : 'Click to load resume'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/user/pages/homepage">
                        <Button 
                            className="w-full sm:w-auto min-w-32"
                            variant="outline"
                            disabled={loading}
                        >
                            🏠 Homepage
                        </Button>
                    </Link>
                    <Button 
                        className="w-full sm:w-auto min-w-32"
                        disabled={loading}
                    >
                        ✏️ Edit Profile
                    </Button>
                </div>

                {/* Loading overlay for initial load */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-zinc-800 p-6 rounded-xl text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-white">Loading your profile...</p>
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}