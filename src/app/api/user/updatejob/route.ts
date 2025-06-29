import { connect } from "@/DBconfig/dbconfig";
import { getUserTokenData } from "@/helpers/getUserTokenData";
import ProfileData from "@/models/profilemodal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
    try {
        const userid = await getUserTokenData(request);
        const reqbody = await request.json();
        const { id,score } = reqbody;

        if (!userid) {
            return NextResponse.json(
                { error: "Userid not found" },
                { status: 404 }
            );
        }

        // const jobdata = await ProfileData.findOne({ userID: userid });
        // const jobid = await jobdata.AppliedJobs.appliedjobID;
        // console.log(jobid);
        // if(jobid==id){
        //     return NextResponse.json({
        //         error:true,
        //         message:"Already applied for this job"
        //     },{status:404})
        // }

        
        // FIX 1: Add upsert option and return the updated document
        const userprofile = await ProfileData.findOneAndUpdate(
            { userID: userid }, 
            { AppliedJobs: {
                appliedjobID:id,
                similarityScore:score,
                appliedbool:true
            } },
            { 
                new: true,        
                upsert: true,    
                runValidators: true 
            }
        );

        return NextResponse.json(
            { 
                success: true, 
                data: userprofile, 
                message: "Successfully updated the data" ,
                applicationStatus:userprofile.AppliedJobs.appliedbool
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Internal server error:', error);
        return NextResponse.json(
            { error: "Internal server error: " + error },
            { status: 500 }
        );
    }
}
