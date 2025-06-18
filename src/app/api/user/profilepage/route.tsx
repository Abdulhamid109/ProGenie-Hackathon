import { connect } from "@/DBconfig/dbconfig";
import { getDatafromToken } from "@/helpers/getDataFromToken";
import ProfileData from "@/models/profilemodal";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";


connect();


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})
export async function POST(request: NextRequest) {
    try {
        // const body = await request.json();
        const formData = await request.formData();
        // const file = formData.get('file');
        // const filename = formData.get('name');
        // const formData = await request.formData();
        const file = formData.get('file');
        const filename = formData.get('name');
        const gender = formData.get('gender');
        const location = formData.get('location');
        const DOB = formData.get('DOB');
        const EmailVerified = formData.get('EmailVerified');
        const CourseName = formData.get('CourseName');
        const Spealization = formData.get('Spealization');
        const ColleageName = formData.get('ColleageName');
        const GradingSystem = formData.get('GradingSystem');
        const Score = formData.get('Score');
        const StartYear = formData.get('StartYear');
        const EndYear = formData.get('EndYear');
        const Type = formData.get('Type');

        if (!file || !filename) {
            return NextResponse.json({ error: 'File and name are required' }, { status: 400 });
        }

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const response = await imagekit.upload({
            file: buffer,
            fileName: filename as string,
            folder: '/resumepdfs', // Optional: specify a folder in ImageKit
        });

        const userID = await getDatafromToken(request);

        
        // for Email Verification will do it later
        const newProfileData = new ProfileData({
            gender,
            location,//location should be fetch from frontend and then send string to backend
            DOB,
            EmailVerified,//Later
            CourseName,
            Spealization,
            ColleageName,
            GradingSystem,
            Score,
            StartYear,
            EndYear,
            Type,
            userID,
            resumelink: response.url,
        });
        console.log("New Profile Data:", newProfileData);


        const savedProfileData = await newProfileData.save();
        return NextResponse.json({
            success: 200,
            message: "Profile Data Saved Successfully",
            data: savedProfileData
        })

    } catch (error) {
        console.log("Error in POST request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}