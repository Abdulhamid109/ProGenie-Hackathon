import {  NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json({
            status:200,
            success:true,
            message:'Logout successfully'
        });

        response.cookies.set('token','',{expires:new Date(0)});
        return response;
    } catch (error) {
        console.log('Failed to logout: ' + error);
        return NextResponse.json({
            status:500,
            error:'Internal server error'
        })
    }
}