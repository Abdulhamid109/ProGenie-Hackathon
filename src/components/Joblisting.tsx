"use client"
import Jobcards from '@/components/Jobcards';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface Job {
  jobtitle: string;
  jobSalary: string;
  AboutCompany: string;
  jobLocation: string;
  jobdescription: string;
  href:string;
  _id:string;
}

const JobPostPage = () => {
    const [data,setdata] = useState<Job[]>([]);

    const alljobfetch = async()=>{
        try {
            const response = await axios.get('/api/user/alljobs');
            if(response.status === 200){
                console.log(response.data.alljobs);
                setdata(response.data.alljobs);
            }else{
                console.log(response.data.message);
            }
        } catch (error) {
            console.log('Failed to fetch the job '+error);
        }
    }

    useEffect(()=>{
        alljobfetch();
    },[])
  return (
    <div className="p-3 space-y-4">
      <div className="text-2xl font-bold">Welcome Mr ... Your Job Postings</div>
      {data.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        data.map((job, index) => (
          <Jobcards
            key={index}
            title={job.jobtitle}
            salary={job.jobSalary}
            company={job.AboutCompany}
            location={job.jobLocation}
            description={job.jobdescription}
            href={`/user/pages/jobdescription/${job._id}`}
          />
        ))
      )}
    </div>
  )
}

export default JobPostPage