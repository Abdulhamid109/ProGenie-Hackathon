import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

interface decodedData{
    uid:string,
    name:string,
    email:string
}

export async function getDatafromToken(request:NextRequest) {
    try {
        const token = request.cookies.get("token")?.value||"";
        const data = jwt.verify(token,process.env.SECRET_KEY!)as decodedData;
        return data.uid;
    } catch (error:unknown) {
        console.log(error);
        
    }
}