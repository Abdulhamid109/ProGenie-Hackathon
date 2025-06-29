// for handling auth suspence boundary

import React, { Suspense } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback="<div className='font-semibold animate-pulse p-3 flex justify-center items-center w-full h-full'>loading...kindly wait</div>">
            {children}
        </Suspense>
    )
}