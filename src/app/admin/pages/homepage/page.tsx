import Link from 'next/link'
import React from 'react'

const AdminHomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col p-4'>
        <h1 className='text-2xl font-sans p-2'>Hello <span className='text-red-700 font-bold text-3xl'>Mr.Recruiter</span></h1>
        <div>
            <div className='p-4 text-center m-2'>
                <h2 className='text-xl font-semibold'>Welcome to the Admin Dashboard</h2>
                <p className='mt-2'>Here you can manage all aspects of the application.</p>
            </div>
        </div>
        
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Link href={'/admin/pages/addjobpage'}>
                <div className='p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-yellow-500 to-yellow-700 text-white hover:from-yellow-600 hover:to-yellow-800 cursor-pointer '>
                    <h3 className='text-lg font-semibold'>Manage Jobs</h3>
                    <p className='mt-2'>Create job postings.</p>
                </div>
                </Link>
                <div className=' p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 cursor-pointer'>
                    <h3 className='text-lg font-semibold'>Manage Jobs</h3>
                    <p className='mt-2'>edit job postings.</p>
                </div>
                <div className=' p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 cursor-pointer'>
                    <h3 className='text-lg font-semibold'>Manage Jobs</h3>
                    <p className='mt-2'>delete job postings.</p>
                </div>
                <div className=' p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 cursor-pointer'>
                    <h3 className='text-lg font-semibold'>View Applications</h3>
                    <p className='mt-2'>Review applications submitted by candidates.</p>
                </div>
                <div className=' p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-pink-500 to-pink-700 text-white hover:from-pink-600 hover:to-pink-800 cursor-pointer'>
                    <h3 className='text-lg font-semibold'>User Management</h3>
                    <p className='mt-2'>Manage user accounts and permissions.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminHomePage