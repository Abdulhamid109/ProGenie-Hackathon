"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Job {
  jobtitle: string;
  jobrole: string;
  jobdescription: string;
  jobExperience: string;
  jobVacancy: string;
  jobLocation: string;
  jobSalary: string;
  jobSkills: string;
  AboutCompany: string;
}

const JobdescriptionPage = () => {
  const [data, setData] = useState<Job>({
    jobtitle: "",
    jobrole: "",
    jobdescription: "",
    jobExperience: "",
    jobVacancy: "",
    jobLocation: "",
    jobSalary: "",
    jobSkills: "",
    AboutCompany: "",
  });
  const [loading, setLoading] = useState(true);

const {id} = useParams();
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/admin/alljobs/${id}`);
      if (response.status === 200) {
        setData(response.data.myjob);
        console.log(response.data.myjob);
      } else if(response.status===404) {
        console.log(response.statusText)
        console.log("Something went wrong!!!!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    console.log(id);
  },[id])

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!id) {
    console.log('THE ID  : ',id)
    return <div>Job ID not provided</div>;
  }

  return (
    <div>
      <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96] mb-2">
        <h1 className="font-bold text-2xl text-shadow-2xs p-2">{data.jobtitle}</h1>
        <h1 className="font-light text-lg p-2">{data.jobExperience}</h1>
        <h1 className="font-light text-lg p-2">{data.jobrole}</h1>
        <h1 className="font-light text-lg p-2">{data.jobSalary}</h1>
        <h1 className="font-light text-sm p-2 flex gap-2">
          <span>{data.jobSkills}</span>
          <b>Vacancy</b>:{data.jobVacancy}
          <span></span>
        </h1>
      </div>
      <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96] mb-2">
        <div className="font-bold text-2xl text-shadow-2xs p-2">Job Description</div>
        <div className="font-light text-lg tracking-tight p-2">{data.jobdescription}</div>
      </div>
      <div className="bg-zinc-700 p-3 rounded-md bg-gradient-to-l from-black/[0.96]">
        <div className="font-bold text-2xl text-shadow-2xs p-2">About Company</div>
        <div className="font-light text-lg tracking-tight p-2">{data.AboutCompany}</div>
      </div>
      
    </div>

  );
};

export default JobdescriptionPage;