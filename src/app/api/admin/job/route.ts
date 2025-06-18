// a single job based on the job ID

import { connect } from "@/DBconfig/dbconfig";
import jobmodal from "@/models/jobModal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const jobid = searchParams.get('jobid');

        const job = await jobmodal.findOne({_id:jobid});
        if(!job){
            return NextResponse.json(
                {message: "Job not found"},
                {status: 404}
            );
        }
        return NextResponse.json(
            {success: true, job: job},
            {status: 200}
        );
    } catch (error) {
        console.log('Something went wrong!! ' + error);
        return NextResponse.json(
            {
                error: 500,
                message: "Internal server error " + error
            },
            { status: 500 }
        )
    }
}