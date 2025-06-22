"use client";
import axios from "axios";
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

const JobDescriptionClient = ({ jobid }:{jobid:Job}) => {
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
  const [error, setError] = useState<string>(null);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/admin/job?jobid=${jobid}`);
      if (response.status === 200) {
        setData(response.data.job);
      } else {
        setError("Failed to fetch job details");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobid) {
      fetchJobDetails();
    } else {
      setLoading(false);
      setError("Job ID not provided");
    }
  }, [jobid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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

export default JobDescriptionClient;