// current profile of user

import { connect } from "@/DBconfig/dbconfig";
import { getUserTokenData } from "@/helpers/getUserTokenData";
import ProfileData from "@/models/profilemodal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const userid = await getUserTokenData(request);
        if (!userid) {
            return NextResponse.json(
                { error: "Failed to fetch the profile data" },
                { status: 404 }
            )
        }
        const user = await ProfileData.findOne({userID:userid});
        return NextResponse.json(
            {success:true,me:user},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" + error },
            { status: 500 }
        )
    }
}