import { connect } from "@/DBconfig/dbconfig";
import { getDatafromToken } from "@/helpers/getDataFromToken";
import jobmodal from "@/models/jobModal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const adminid = await getDatafromToken(request);
        const reqbody = await request.json();
        const { jobcleantext } = reqbody;

        if (!adminid) {
            return NextResponse.json(
                { error: "Userid not found" },
                { status: 404 }
            );
        }

        // FIX 1: Add upsert option and return the updated document
        const userprofile = await jobmodal.findOneAndUpdate(
            { adminID: adminid }, 
            { jobcleantext: jobcleantext },
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
