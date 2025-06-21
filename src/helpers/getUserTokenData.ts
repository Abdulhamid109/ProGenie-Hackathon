import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

interface decodedData{
    id:string,
    email:string
}

export async function getUserTokenData(request:NextRequest) {
    try {
        const token = request.cookies.get("usertoken")?.value||"";
        const data = jwt.verify(token,process.env.USER_SECRET_KEY!)as decodedData;
        return data.id;
    } catch (error:unknown) {
        console.log(error);
        
    }
}