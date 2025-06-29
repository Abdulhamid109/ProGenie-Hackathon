import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

interface decodedData{
    id:string,
}

export async function getjobDatafromToken(request:NextRequest) {
    try {
        const token = request.cookies.get("jobtoken")?.value||"";
        const data = jwt.verify(token,process.env.JOB_SECRET_KEY!)as decodedData;
        return data.id;
    } catch (error:unknown) {
        console.log(error);
        
    }
}