import { connect } from "@/DBconfig/dbconfig";
import { getUserTokenData } from "@/helpers/getUserTokenData";
import ProfileData from "@/models/profilemodal";
import { NextRequest, NextResponse } from "next/server";


connect();
export async function GET(request:NextRequest){
    try {
        const userid = await getUserTokenData(request);
        console.log('User id : '+userid)
        if(!userid){
            return NextResponse.json(
                {error:"Userid not found"},
                {status:404}
            );
        }
        const userprofile = await ProfileData.findOne({userID:userid});
        

        return NextResponse.json(
            {success:true,resume:userprofile.resumelink},
            {status:200}
        )

    } catch (error) {
        console.log('Failed to fetch the resume link '+error);
        return NextResponse.json(
            {error:"internal server error"+error},
            {status:500}
        )
    }
}