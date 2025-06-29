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

        // FIX 1: Add upsert option and return the updated document
        const userprofile = await ProfileData.findOneAndUpdate(
            { userID: userid }, 
            { resumecleantext: resumecleantext },
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
                message: "Successfully added the clean resume text" 
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
