// adding the jobs into the database

import { connect } from "@/DBconfig/dbconfig";
import { getDatafromToken } from "@/helpers/getDataFromToken";
import jobmodal from "@/models/jobModal";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request:NextRequest) {
    try {
        const body = await request.json();
        const { jobtitle, jobrole, jobdescription, jobExperience, jobVacancy, jobLocation, jobSalary, jobSkills, AboutCompany } = body;
        if (!jobtitle || !jobrole || !jobdescription || !jobExperience || !jobVacancy || !jobLocation || !jobSalary || !jobSkills || !AboutCompany) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        const adminID = await getDatafromToken(request);
        if(!adminID){
            return NextResponse.json(
                {error: 'Unauthorized access, please login again'},
                {status: 401}
            )
        }
        const jobdata = new jobmodal({
            jobtitle,
            jobrole,
            jobdescription,
            jobExperience,
            jobVacancy,
            jobLocation,
            jobSalary,
            jobSkills,
            AboutCompany,
            adminID: adminID
        });

        const savedJob = await jobdata.save();
        // set the cookies
        const payload ={
            id:savedJob._id
        }
        const token = jwt.sign(payload,process.env.JOB_SECRET_KEY!,{expiresIn:'1d'});
        const response =  NextResponse.json(
            {success:true, message: 'Job added successfully', job: savedJob},
            {status: 200}
        );

        response.cookies.set('jobtoken',token,{httpOnly:true});
        return response;
        
    } catch (error) {
        console.log('Something went wrong!! '+error);
        return NextResponse.json({
            error:500,
            message:"Internal server error "+error
        })
    }
}