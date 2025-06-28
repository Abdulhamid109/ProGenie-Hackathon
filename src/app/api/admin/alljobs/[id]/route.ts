import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import JobModel from "@/models/jobModal";
import { connect } from "@/DBconfig/dbconfig";

connect()
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const job = await JobModel.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, myjob: job }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
