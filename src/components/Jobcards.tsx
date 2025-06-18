import Link from 'next/link';
import React from 'react';

interface JobCardProps {
  title: string;
  salary: string;
  company: string;
  location: string;
  description: string;
  href:string
}

const Jobcards = ({ title, salary, company, location, description,href }: JobCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="font-bold text-xl text-gray-800 mb-2">Job Title: {title}</h3>
      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
        <span >Salary range:<span className="font-semibold">{salary}</span> </span>
        <span className="font-semibold">Company: <span className='font-semibold'>{company}</span></span>
        <span>Location: <span className='font-semibold'>{location}</span></span>
      </div>
      <p className="text-gray-600 line-clamp-3">Description:{description}</p>
      <div className="flex justify-end mt-4">
        <Link href={href} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
          View Job Description
        </Link>
      </div>
    </div>
  );
};

export default Jobcards;
