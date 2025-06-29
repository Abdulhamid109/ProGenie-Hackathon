'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface addjobData {
  jobtitle: string;
  jobrole: string,
  jobdescription: string,
  jobExperience: string,
  jobVacancy: string,
  jobLocation: string,
  jobSalary: string,
  jobSkills: string,
  AboutCompany: string,
  adminID: string,
  // resumelink:response.url,
}

const AddJobPage = () => {
  const [data, setData] = useState<addjobData>({
    jobtitle: "",
    jobrole: "",
    jobdescription: "",
    jobExperience: "",
    jobVacancy: "",
    jobLocation: "",
    jobSalary: "",
    jobSkills: "",
    AboutCompany: "",
    adminID: "",
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [textdata, settextdata] = useState<string>('');

  const addjobData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDisable(true);
    setError(null);
    setMessage(null);
    setLoadingStep('Saving profile data...');

    try {
      const response = await axios.post('/api/admin/addjob', data);
      if (response.status === 200) {
        console.log(response.data)
        setLoadingStep('loading...')
        
        // Fix: Convert job object to string for the summarizer
        let jobText = '';
        if (typeof response.data.job === 'string') {
          jobText = response.data.job;
        } else if (typeof response.data.job === 'object') {
          // Convert object to formatted string
          jobText = JSON.stringify(response.data.job, null, 2);
          // Or create a more readable format:
          // jobText = `
          //   Job Title: ${response.data.job.jobtitle || ''}
          //   Job Role: ${response.data.job.jobrole || ''}
          //   Description: ${response.data.job.jobdescription || ''}
          //   Experience: ${response.data.job.jobExperience || ''}
          //   Location: ${response.data.job.jobLocation || ''}
          //   Salary: ${response.data.job.jobSalary || ''}
          //   Skills: ${response.data.job.jobSkills || ''}
          //   About Company: ${response.data.job.AboutCompany || ''}
          // `.trim();
        }
        
        settextdata(jobText);
        console.log("data"+textdata);
        await processJob(jobText);
      } else {
        setError('Something went wrong! Please try again.');

        console.log(response)
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      setError('Something went wrong! Please try again.'+error);
    } 
  };

  const processJob = async (jobTextData: string) => {
    try {
      // Step 2: Fetch resume link
      setLoadingStep('fetching Job details...');
      
      console.log(data);
      
      // Validate that we have text data
      if (!jobTextData || jobTextData.trim() === '') {
        throw new Error('No job text data to process');
      }

      // Step 4: Summarize the text
      setLoadingStep('Summarizing Job details...');
      
      console.log('Sending to summarizer:', { text_data: jobTextData });
      
      const summaryResponse = await axios.post(
        "https://076c-103-171-118-186.ngrok-free.app/summarizer", 
        { "text_data": jobTextData }, // Now guaranteed to be a string
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // Add this for ngrok
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (summaryResponse.status !== 200) {
        throw new Error(`Failed to summarize Job data: ${summaryResponse.status}`);
      }

      const summary = summaryResponse.data.summary;
      console.log('Resume summarized successfully');

      // Step 5: Clean the summarized text
      setLoadingStep('Processing and cleaning Job data...');
      const cleanResponse = await axios.post(
        "https://076c-103-171-118-186.ngrok-free.app/clean", 
        { "text_data": summary },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          timeout: 30000
        }
      );

      if (cleanResponse.status !== 200) {
        throw new Error(`Failed to clean text: ${cleanResponse.status}`);
      }

      const cleanedText = cleanResponse.data.cleaned_text;
      console.log('Text cleaned successfully');

      // Step 6: Save cleaned text to database
      setLoadingStep('Saving processed data...');
      const saveResponse = await axios.post('/api/admin/addcleantext', {
        "jobcleantext": cleanedText
      });

      if (saveResponse.status !== 200) {
        throw new Error('Failed to save processed resume data');
      }

      console.log('Successfully updated the database');
      setMessage('Job created successfully!');
      
      // Wait a moment to show success message
      setTimeout(() => {
        router.push('/admin/pages/homepage');
      }, 2000);

    } catch (error) {
      console.error('Resume processing error:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (error.response?.status === 422) {
          setError('Invalid data format sent to server. Please check your input.');
        } else if (error.response!.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        setError('Failed to process Job data. Please try again.');
      }
    } finally {
      setLoading(false);
      setDisable(false);
      setLoadingStep('');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col items-center justify-center p-4'>
      <div className='text-center text-3xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-fade-in'>
        Enter your Job details...
      </div>
      <div className='flex flex-col items-center justify-center bg-gradient-to-l from-yellow-950/80 to-zinc-800/80 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:shadow-black/70'>
        <h2 className='text-2xl font-semibold text-zinc-100 mb-6'>Abdulhamid</h2>
        <input
          type="text"
          value={data.jobtitle}
          onChange={(e) => setData({ ...data, jobtitle: e.target.value })}
          placeholder='Jobtitle'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobrole}
          onChange={(e) => setData({ ...data, jobrole: e.target.value })}
          placeholder='Jobrole'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobdescription}
          onChange={(e) => setData({ ...data, jobdescription: e.target.value })}
          placeholder='jobdescription'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobExperience}
          onChange={(e) => setData({ ...data, jobExperience: e.target.value })}
          placeholder='Job Experience eg:(0-1yrs)'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobVacancy}
          onChange={(e) => setData({ ...data, jobVacancy: e.target.value })}
          placeholder='Job Vacancy eg:(10)'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.jobLocation}
          onChange={(e) => setData({ ...data, jobLocation: (e.target.value) })}
          placeholder='Job Location'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobSalary}
          onChange={(e) => setData({ ...data, jobSalary: (e.target.value) })}
          placeholder='Salary range eg:(3L-4L)pa'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.jobSkills}
          onChange={(e) => setData({ ...data, jobSkills: (e.target.value) })}
          placeholder='Skills required for this job...'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />
        <input
          type="text"
          value={data.AboutCompany}
          onChange={(e) => setData({ ...data, AboutCompany: (e.target.value) })}
          placeholder='Description about the Company'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
        />

        {/* Loading Step Indicator */}
        {loading && loadingStep && (
          <div className='w-full p-2 mb-4 text-center text-blue-300 text-sm animate-pulse'>
            {loadingStep}
          </div>
        )}

        <button
          className='w-full p-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={addjobData}
          disabled={disable}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {message && <p className='text-green-400 mt-4 font-medium animate-fade-in'>{message}</p>}
        {error && <p className='text-red-400 mt-4 font-medium animate-fade-in'>{error}</p>}
      </div>
    </div>
  )
}

export default AddJobPage
