// here we will display all the jobs

import { connect } from "@/DBconfig/dbconfig";
import { getDatafromToken } from "@/helpers/getDataFromToken";
import jobmodal from "@/models/jobModal";
// import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function GET(request:NextRequest) {
    try {
        const adminID = await getDatafromToken(request);
        console.log(adminID)
        const jobs = await jobmodal.find({adminID:adminID});
        // console.log(jobs)
        // const alljobs = await jobmodal.find();
        if (jobs.length === 0) {
            return NextResponse.json(
                { message: "No jobs found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, adminjobs:jobs},
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