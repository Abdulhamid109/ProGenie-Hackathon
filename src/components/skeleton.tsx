import React from 'react'

const LoadingSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96] mb-2">
                <div className="h-8 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="h-6 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="h-6 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="h-6 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="h-4 bg-zinc-600 rounded w-full"></div>
            </div>
            <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96] mb-2">
                <div className="h-8 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-zinc-600 rounded w-full"></div>
                    <div className="h-4 bg-zinc-600 rounded w-full"></div>
                    <div className="h-4 bg-zinc-600 rounded w-full"></div>
                </div>
            </div>
            <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96]">
                <div className="h-8 bg-zinc-600 rounded mb-2 w-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-zinc-600 rounded w-full"></div>
                    <div className="h-4 bg-zinc-600 rounded w-full"></div>
                </div>
            </div>
        </div>
    );

}

export default LoadingSkeleton