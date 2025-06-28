'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface ProfileData {
  gender: string;
  // password: string;
  location: string,//location should be fetch from frontend and then send string to backend
  DOB: string,
  // EmailVerified,//Later
  CourseName: string,
  Spealization: string,
  ColleageName: string,
  GradingSystem: string,
  Score: string,
  StartYear: string,
  EndYear: string,
  Type: string,
  phoneno: string
  // userID,
  // resumelink:response.url,
}

const ProfilePage = () => {
  const [data, setData] = useState<ProfileData>({
    gender: "",
    DOB: "",
    location: "", //location should be fetch from frontend and then send string to backend
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

  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  // const [resumetext,setresumetext] = useState<string>('');
  // const [summarizeresumetext,setsummarizeresumetext] = useState<string>('');
  const [cleantext, setcleantext] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile) {
        setFile(selectedFile);
        setFilename(selectedFile.name);
        setError(null);
      } else {
        setError("Only PDF files are allowed.");
        setFile(null);
      }
    } else {
      setFile(null);
    }
  }
  const addProfileData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('name', filename);
      formData.append('data', JSON.stringify(data));
      formData.append('name', filename);
      formData.append('gender', data.gender);
      formData.append('DOB', data.DOB);
      formData.append('location', data.location);
      formData.append('CourseName', data.CourseName);
      formData.append('Spealization', data.Spealization);
      formData.append('ColleageName', data.ColleageName);
      formData.append('GradingSystem', data.GradingSystem);
      formData.append('Score', data.Score);
      formData.append('StartYear', data.StartYear);
      formData.append('EndYear', data.EndYear);
      formData.append('Type', data.Type);
      formData.append('phoneno', data.phoneno);
      console.log(formData)
      const response = await axios.post('/api/user/profilepage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        fetchresumelink()
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      setError('Something went wrong! Please try again.');
    } 
  };

  // backend stuff



  const fetchresumelink = async () => {
    try {
      const response = await axios.get('/api/user/resume');
      if (response.status === 200) {
        // setresume(response.data.resume)
        console.log(response.data.resume)
        resumedata(response.data.resume)
      } else if (response.status === 404) {
        setError('User not found!!')
      } else {
        setError('Something went wrong...')
      }
    } catch (error) {
      console.log('Failed to fetch the resume link' + error);
    }
  }

  const resumedata = async (resume: string) => {
    try {
      const response = await axios.post("https://076c-103-171-118-186.ngrok-free.app/extractresume", { "resume_link": resume });
      if (response.status === 200) {
        console.log('Resume data ' + response);
        // setresumetext(response.data.text);
        summarizedata(response.data.text)
      } else {
        setError('Something went wrong!!')
      }
    } catch (error) {
      console.log('Failed to do the acction ' + error);
      setError('Failed to do the acction ' + error)
    }
  }

  const summarizedata = async (resumetext: string) => {
    try {
      const response = await axios.post("https://076c-103-171-118-186.ngrok-free.app/summarizer", { "text_data": resumetext });
      if (response.status === 200) {
        console.log('Resume data ' + response.data.summary);
        // setsummarizeresumetext(response.data.summary);
        cleandata(response.data.summary)
      } else {
        setError('Something went wrong!!')
      }
    } catch (error) {
      console.log('Failed to do the acction ' + error);
      setError('Failed to do the acction ' + error)
    }
  }

  const cleandata = async (summarizeresumetext: string) => {
    
    try {
      const response = await axios.post("https://076c-103-171-118-186.ngrok-free.app/clean", { "text_data": summarizeresumetext });
      if (response.status === 200) {
        setcleantext(response.data.cleaned_text);
        await addcleantext();
        router.push('/user/pages/homepage')
      } else {
        setError('Something went wrong!!')
      }
    } catch (error) {
      console.log('Something went wrong...' + error);
    }
  }

  const addcleantext=async()=>{
    setDisable(true);
    setLoading(true);
    try {
      const response = await axios.post('/api/user/addcleantext',{
        "resumecleantext":cleantext
      });
      if(response.status===200){
        console.log('Successfully updated the database');
        setMessage('Successfully Profile Created...')
        console.log('reponse=> '+response.data.data)
      }
    } catch (error) {
      console.log('error in adding data to db',error);

    }finally {
      setLoading(false);
      setDisable(false);
    }
  }


  // const valuedemonstration = () => {
  //   console.log("Data:", data);
  // }
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-blue-900 flex flex-col items-center justify-center p-4'>
      <div className='text-center text-3xl md:text-4xl font-bold text-zinc-200 mb-8 tracking-tight animate-fade-in'>
        Enter your credentials to continue...
      </div>
      <div className='flex flex-col items-center justify-center bg-gradient-to-l from-yellow-950/80 to-zinc-800/80 w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:shadow-black/70'>
        <h2 className='text-2xl font-semibold text-zinc-100 mb-6'>Abdulhamid</h2>
        <select
          value={data.gender}
          onChange={(e) => setData({ ...data, gender: e.target.value })}
          className="w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-900 transition-all duration-200"
          required
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="date" className='flex items-start justify-items-start w-full p-1'>
          Enter the D.O.B
        </label>
        <input
          type="date"
          value={data.DOB}
          onChange={(e) => setData({ ...data, DOB: e.target.value })}
          // placeholder='Enter your password'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          placeholder='Enter your City'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.ColleageName}
          onChange={(e) => setData({ ...data, ColleageName: e.target.value })}
          placeholder='Enter your college name'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.CourseName}
          onChange={(e) => setData({ ...data, CourseName: e.target.value })}
          placeholder='Enter your Course Name'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.Spealization}
          onChange={(e) => setData({ ...data, Spealization: e.target.value })}
          placeholder='Enter your Spealization'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <input
          type="text"
          value={data.phoneno}
          onChange={(e) => setData({ ...data, phoneno: e.target.value })}
          placeholder='Enter your phone number'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <select
          value={data.GradingSystem}
          onChange={(e) => setData({ ...data, GradingSystem: e.target.value })}
          className="w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-900 transition-all duration-200"
          required
        >
          <option value="" disabled>
            Select Grading System
          </option>
          <option value="GPA">GPA(0-4)</option>
          <option value="CGPA">CGPA(0-10)</option>
          <option value="Percentage">Percentage(0-100)</option>
        </select>
        <input
          type="text"
          value={data.Score}
          onChange={(e) => setData({ ...data, Score: (e.target.value) })}
          placeholder='Enter your Score (GPA/CGPA/Percentage)'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <label htmlFor="date" className='flex items-start justify-items-start w-full p-1'>
          Enter the Starting Date
        </label>
        <input
          type="date"
          value={data.StartYear}
          onChange={(e) => setData({ ...data, StartYear: (e.target.value) })}
          placeholder='Enter your Start Year'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <label htmlFor="date" className='flex items-start justify-items-start w-full p-1'>
          Enter the Ending Date
        </label>
        <input
          type="date"
          value={data.EndYear}
          onChange={(e) => setData({ ...data, EndYear: (e.target.value) })}
          placeholder='Enter your End Year'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <select
          value={data.Type}
          onChange={(e) => setData({ ...data, Type: e.target.value })}
          className="w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-900 transition-all duration-200"
          required
        >
          <option value="" disabled >
            Select Schooling Type
          </option>
          <option value="Regular">Regular</option>
          <option value="Full-Time">Full-time</option>
          <option value="Part-Time">Part-time</option>
        </select>
        <label htmlFor="Resume" className='flex items-start justify-items-start w-full p-1'>
          Upload your Resume <span className='text-sm opacity-20 p-1 text-white'>(.pdf only supported)</span>
        </label>
        <input
          type="file"
          accept='application/pdf'
          onChange={handlefileChange}
          placeholder='Enter your End Year'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
        />
        <button
          className='w-full p-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={addProfileData}
          disabled={disable}
        >

          {loading ? "Processing... takes 12-15 s" : "Save"}
        </button>
        {message && <p className='text-green-400 mt-4 font-medium animate-fade-in'>{message}</p>}
        {error && <p className='text-red-400 mt-4 font-medium animate-fade-in'>{error}</p>}
      </div>
    </div>
  )


}

export default ProfilePage