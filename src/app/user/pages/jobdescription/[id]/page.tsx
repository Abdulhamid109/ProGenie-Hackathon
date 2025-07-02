"use client";
import LoadingSkeleton from "@/components/skeleton";
import { Button } from "@/components/ui/button";
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
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Fetching job details...');
  const [jobcleantext, setjobcleantext] = useState<string>('');
  const [userresumetext, setuserresumetext] = useState<string>('');
  const [sim, setsim] = useState<number>();
  const [applied,setapplied]= useState<boolean>();
  const [error, setError] = useState<string>('');

  const { id } = useParams();

  const fetchJobDetails = async () => {
    try {
      setLoadingStep('Fetching job details...');
      const response = await axios.get(`/api/user/alljobs/${id}`);
      if (response.status === 200) {
        setData(response.data.dataa);
        setjobcleantext(response.data.dataa.jobcleantext);
        console.log("clean data: " + response.data.dataa.jobcleantext);
        // Check if user has already applied for this job
        setapplied(false);
      } else {
        setError("Failed to load job details");
      }
    } catch (error) {
      console.log(error);
      setError("Error loading job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchuserdata = async () => {
    try {
      setLoadingStep('Loading your profile...');
      const response = await axios.get('/api/user/me');
      if (response.status === 200) {
        setuserresumetext(response.data.me.resumecleantext);
        console.log('resume clean text => ' + response.data.me.resumecleantext);
      } else {
        console.log("Failed to load user data");
      }
    } catch (error) {
      console.log('Failed to fetch user data: ' + error);
    } finally {
      setUserDataLoading(false);
    }
  };

  const computesimilarity = async () => {
    if (!userresumetext || !jobcleantext) {
      setError("Missing resume or job data");
      return;
    }

    setApplyLoading(true);
    setError('');
    
    try {
      setLoadingStep('Analyzing resume compatibility...');
      const response = await axios.post('https://076c-103-171-118-186.ngrok-free.app/similarity', {
        "resume_text": userresumetext,
        "profile_text": jobcleantext
      });

      if (response.status === 200) {
        setsim(response.data.score);
        setLoadingStep('Submitting application...');
        await updatethedata();
        setLoadingStep('Application submitted successfully!');
      }
    } catch (error) {
      console.log('Failed to compute similarity: ' + error);
      setError("Failed to process application");
    } finally {
      setApplyLoading(false);
    }
  };

  const updatethedata = async () => {
    try {
      const response = await axios.put('/api/user/updatejob', { id, sim });
      if (response.status === 200) {
        console.log('Successfully updated the status');
        console.log('applied (boolean) =>' + response.data.applicationStatus);
        setapplied(true);
      }else if(response.status===404){
        setError(response.data.message);
      }
    } catch (error) {
      console.log('Failed to update: ' + error);
      throw error; // Re-throw to be caught by computesimilarity
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    } else {
      setLoading(false);
      setError("Job ID not provided");
    }
  }, [id]);

  useEffect(() => {
    fetchuserdata();
  }, []);

  // Loading skeleton component
  

  // Main loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="text-lg font-medium">{loadingStep}</p>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-xl">⚠️</div>
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <Button 
          onClick={() => {
            setError('');
            setLoading(true);
            fetchJobDetails();
          }}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // No job ID provided
  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-yellow-500 text-xl">⚠️</div>
        <p className="text-yellow-500 text-lg font-medium">Job ID not provided</p>
      </div>
    );
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
          <b>Vacancy</b>: {data.jobVacancy}
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

      {/* Application section */}
      <div className="flex m-2 justify-center items-center flex-col space-y-2">
        {applyLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">{loadingStep}</span>
          </div>
        )}
        
        {sim !== undefined && (
          <div className={`text-sm font-medium ${sim >= 70 ? 'text-green-400' : 'text-red-400'}`}>
            Match Score: {(sim).toFixed(1)}%
            {sim >= 70 && " - Great match! 🎯"}
          </div>
        )}

        <Button
          onClick={computesimilarity}
          disabled={applyLoading || userDataLoading || !userresumetext || !jobcleantext || applied}
          className={`relative ${applied ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {applyLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : applied ? (
            <div className="flex items-center space-x-2">
              <span>✅ Applied</span>
            </div>
          ) : (
            "Apply Now"
          )}
        </Button>

        {userDataLoading && (
          <p className="text-xs text-gray-400">Loading your profile data...</p>
        )}
      </div>
    </div>
  );
};

export default JobdescriptionPage;