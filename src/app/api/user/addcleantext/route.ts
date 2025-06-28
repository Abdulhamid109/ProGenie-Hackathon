// here we will be adding the cleaned text resume data

import { connect } from "@/DBconfig/dbconfig";
import { getUserTokenData } from "@/helpers/getUserTokenData";
import ProfileData from "@/models/profilemodal";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest) {
    try {
        const userid = await getUserTokenData(request);
        const reqbody = await request.json();
        const { resumecleantext } = reqbody;
        if (!userid) {
            return NextResponse.json(
                { error: "Userid not found" },
                { status: 404 }
            );
        }
        const userprofile = await ProfileData.findOneAndUpdate({ userID: userid }, { resumecleantext: resumecleantext });
        return NextResponse.json(
            { success: true, data: userprofile, message: "successfully added the clean resume text" },
            { status: 200 }
        )
    } catch (error) {
        console.log('Internal server error ' + error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        )
    }
}