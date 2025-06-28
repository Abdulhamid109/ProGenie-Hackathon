'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface ProfileData {
  gender: string;
  location: string;
  DOB: string;
  CourseName: string;
  Spealization: string;
  ColleageName: string;
  GradingSystem: string;
  Score: string;
  StartYear: string;
  EndYear: string;
  Type: string;
  phoneno: string;
}

const ProfilePage = () => {
  const [data, setData] = useState<ProfileData>({
    gender: "",
    DOB: "",
    location: "",
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
  const [filename, setFilename] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFilename(selectedFile.name);
        setError(null);
      } else {
        setError("Only PDF files are allowed.");
        setFile(null);
        setFilename('');
      }
    } else {
      setFile(null);
      setFilename('');
    }
  }

  const addProfileData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!file) {
      setError('Please upload a resume PDF file.');
      return;
    }

    if (!data.gender || !data.DOB || !data.location || !data.phoneno) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    setLoadingStep('Saving profile data...');

    try {
      // Step 1: Save profile data
      const formData = new FormData();
      formData.append('file', file);
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

      const response = await axios.post('/api/user/profilepage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setLoadingStep('Fetching resume...');
        await processResume();
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      setError('Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  const processResume = async () => {
    try {
      // Step 2: Fetch resume link
      setLoadingStep('Getting resume link...');
      const resumeResponse = await axios.get('/api/user/resume');
      
      if (resumeResponse.status !== 200) {
        throw new Error('Failed to fetch resume link');
      }

      const resumeUrl = resumeResponse.data.resume;
      console.log('Resume URL:', resumeUrl);

      // Step 3: Extract text from resume
      setLoadingStep('Extracting text from resume...');
      const extractResponse = await axios.post(
        "https://076c-103-171-118-186.ngrok-free.app/extractresume", 
        { "resume_link": resumeUrl }
      );

      if (extractResponse.status !== 200) {
        throw new Error('Failed to extract text from resume');
      }

      const extractedText = extractResponse.data.text;
      console.log('Text extracted successfully');

      // Step 4: Summarize the text
      setLoadingStep('Summarizing resume content...');
      const summaryResponse = await axios.post(
        "https://076c-103-171-118-186.ngrok-free.app/summarizer", 
        { "text_data": extractedText }
      );

      if (summaryResponse.status !== 200) {
        throw new Error('Failed to summarize resume');
      }

      const summary = summaryResponse.data.summary;
      console.log('Resume summarized successfully');

      // Step 5: Clean the summarized text
      setLoadingStep('Processing and cleaning text...');
      const cleanResponse = await axios.post(
        "https://076c-103-171-118-186.ngrok-free.app/clean", 
        { "text_data": summary }
      );

      if (cleanResponse.status !== 200) {
        throw new Error('Failed to clean text');
      }

      const cleanedText = cleanResponse.data.cleaned_text;
      console.log('Text cleaned successfully');

      // Step 6: Save cleaned text to database
      setLoadingStep('Saving processed data...');
      const saveResponse = await axios.post('/api/user/addcleantext', {
        "resumecleantext": cleanedText
      });

      if (saveResponse.status !== 200) {
        throw new Error('Failed to save processed resume data');
      }

      console.log('Successfully updated the database');
      setMessage('Profile created successfully!');
      
      // Wait a moment to show success message
      setTimeout(() => {
        router.push('/user/pages/homepage');
      }, 2000);

    } catch (error) {
      console.error('Resume processing error:', error);
      setError('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

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
          disabled={loading}
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="dob" className='flex items-start justify-items-start w-full p-1 text-zinc-300'>
          Enter the D.O.B *
        </label>
        <input
          id="dob"
          type="date"
          value={data.DOB}
          onChange={(e) => setData({ ...data, DOB: e.target.value })}
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
          disabled={loading}
        />

        <input
          type="text"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          placeholder='Enter your City *'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
          disabled={loading}
        />

        <input
          type="text"
          value={data.ColleageName}
          onChange={(e) => setData({ ...data, ColleageName: e.target.value })}
          placeholder='Enter your college name'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <input
          type="text"
          value={data.CourseName}
          onChange={(e) => setData({ ...data, CourseName: e.target.value })}
          placeholder='Enter your Course Name'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <input
          type="text"
          value={data.Spealization}
          onChange={(e) => setData({ ...data, Spealization: e.target.value })}
          placeholder='Enter your Specialization'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <input
          type="tel"
          value={data.phoneno}
          onChange={(e) => setData({ ...data, phoneno: e.target.value })}
          placeholder='Enter your phone number *'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
          disabled={loading}
        />

        <select
          value={data.GradingSystem}
          onChange={(e) => setData({ ...data, GradingSystem: e.target.value })}
          className="w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-900 transition-all duration-200"
          disabled={loading}
        >
          <option value="" disabled>Select Grading System</option>
          <option value="GPA">GPA(0-4)</option>
          <option value="CGPA">CGPA(0-10)</option>
          <option value="Percentage">Percentage(0-100)</option>
        </select>

        <input
          type="text"
          value={data.Score}
          onChange={(e) => setData({ ...data, Score: e.target.value })}
          placeholder='Enter your Score (GPA/CGPA/Percentage)'
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <label htmlFor="startdate" className='flex items-start justify-items-start w-full p-1 text-zinc-300'>
          Enter the Starting Date
        </label>
        <input
          id="startdate"
          type="date"
          value={data.StartYear}
          onChange={(e) => setData({ ...data, StartYear: e.target.value })}
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <label htmlFor="enddate" className='flex items-start justify-items-start w-full p-1 text-zinc-300'>
          Enter the Ending Date
        </label>
        <input
          id="enddate"
          type="date"
          value={data.EndYear}
          onChange={(e) => setData({ ...data, EndYear: e.target.value })}
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          disabled={loading}
        />

        <select
          value={data.Type}
          onChange={(e) => setData({ ...data, Type: e.target.value })}
          className="w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-900 transition-all duration-200"
          disabled={loading}
        >
          <option value="" disabled>Select Schooling Type</option>
          <option value="Regular">Regular</option>
          <option value="Full-Time">Full-time</option>
          <option value="Part-Time">Part-time</option>
        </select>

        <label htmlFor="resume" className='flex items-start justify-items-start w-full p-1 text-zinc-300'>
          Upload your Resume * <span className='text-sm opacity-70 p-1 text-white'>(.pdf only supported)</span>
        </label>
        <input
          id="resume"
          type="file"
          accept='application/pdf'
          onChange={handlefileChange}
          className='w-full p-3 mb-4 bg-zinc-700/50 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 transition-all duration-200'
          required
          disabled={loading}
        />

        {/* Loading Step Indicator */}
        {loading && loadingStep && (
          <div className='w-full p-2 mb-4 text-center text-blue-300 text-sm animate-pulse'>
            {loadingStep}
          </div>
        )}

        <button
          type="submit"
          className='w-full p-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={addProfileData}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Save Profile"
          )}
        </button>

        {message && (
          <p className='text-green-400 mt-4 font-medium animate-fade-in text-center'>
            {message}
          </p>
        )}
        {error && (
          <p className='text-red-400 mt-4 font-medium animate-fade-in text-center'>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfilePage