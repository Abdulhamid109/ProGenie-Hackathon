// here we will fetch all the candidates who have applied for a particular job based on job ID

import { connect } from "@/DBconfig/dbconfig";
import jobmodal from "@/models/jobModal";
import { NextRequest, NextResponse } from "next/server";


connect();


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobID = searchParams.get("jobID");

        const job = await jobmodal.findOne({ _id: jobID });
        if (!job) {
            return NextResponse.json({
                error: "Job not found",
                status: 404
            })
        }
        const appliedCandidates = job.Appliedcandiates || [];
        if (appliedCandidates.length === 0) {
            return NextResponse.json({
                message: "No candidates have applied for this job",
                status: 200
            })
        }
        

        const sortedCandidates = [...appliedCandidates].sort(
            (a, b) => parseFloat(b.similarityScore) - parseFloat(a.similarityScore)
        );

        return NextResponse.json(
            {
                candidates: sortedCandidates,
                count: sortedCandidates.length,
                status: 200,
                success:true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in fetching all candidates: ", error);
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500
        })
    }
}