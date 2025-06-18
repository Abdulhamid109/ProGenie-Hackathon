// here we will display all the jobs

import { connect } from "@/DBconfig/dbconfig";
import jobmodal from "@/models/jobModal";
import {  NextResponse } from "next/server";


connect();

export async function GET() {
    try {
        
        const jobs = await jobmodal.find();
        if (jobs.length === 0) {
            return NextResponse.json(
                { message: "No jobs found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, alljobs:jobs},
            { status: 200 }
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