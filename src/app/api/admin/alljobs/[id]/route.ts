import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import JobModal from "@/models/jobModal";
import { connect } from "@/DBconfig/dbconfig";

connect();

interface RouteParams {
  params: {
    id: string;
  };
}
export async function GET(request: NextRequest,{ params }: RouteParams ) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const job = await JobModal.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, myjob: job }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
