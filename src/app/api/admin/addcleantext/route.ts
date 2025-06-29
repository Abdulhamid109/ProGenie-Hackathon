import { connect } from "@/DBconfig/dbconfig";
import { getjobDatafromToken } from "@/helpers/getjobdatafromtoken";
import jobmodal from "@/models/jobModal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
    try {
        // const adminid = await getDatafromToken(request);
        // we need to create the new job token
        const jobid = await getjobDatafromToken(request);
        const reqbody = await request.json();
        const { jobcleantext } = reqbody;

        console.log("Job ID => ", jobid);
        console.log("Jobdata => ", jobcleantext);

        if (!jobid) {
            return NextResponse.json(
                { error: "Job ID not found" },
                { status: 404 }
            );
        }

        if (!jobcleantext) {
            return NextResponse.json(
                { error: "Job clean text is required" },
                { status: 400 }
            );
        }

        // FIX: Add proper options to findOneAndUpdate
        const userprofile = await jobmodal.findOneAndUpdate(
            { _id: jobid },
            {
                $set: { jobcleantext: jobcleantext } // Explicitly use $set operator
            },
            {
                new: true,
                upsert: false,
                runValidators: true
            }
        );

        if (!userprofile) {
            return NextResponse.json(
                { error: "Job record not found for this admin" },
                { status: 404 }
            );
        }

        console.log("Updated job profile:", userprofile);

        return NextResponse.json(
            {
                success: true,
                data: userprofile,
                message: "Successfully added the clean job text"
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