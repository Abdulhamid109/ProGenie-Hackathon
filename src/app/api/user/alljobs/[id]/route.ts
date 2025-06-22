import { connect } from "@/DBconfig/dbconfig"; // Verify case
import JobModal from "@/models/jobModal"; // Verify case
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


connect();
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
  

    // Await params to resolve the id
    const { id } = await params;
    console.log("Received job ID:", id);

    // Validate id
    if (!id || typeof id !== "string") {
      console.log("Invalid job ID:", id);
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const jobId = new mongoose.Types.ObjectId(id);
    console.log("Querying job with ID:", jobId);
    const job = await JobModal.findById(jobId);

    if (!job) {
      console.log("Job not found for ID:", jobId);
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    console.log("Job found:", job);
    return NextResponse.json(
      { success: true, job },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/user/alljobs/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}