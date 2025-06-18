import { connect } from "@/DBconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from "@/models/adminmodal";


connect();


export async function POST(request:NextRequest){
    try {
        const body = await request.json();
        const {email,password} = body;
        const dbAdmin = await Admin.findOne({email:email});
        if(!dbAdmin){
            return NextResponse.json({
                status: 404,
                'error': 'Admin not found'
            })
        }else{
            // password verification logic
            const pass = await bcrypt.compare(password,dbAdmin.password);
            if(!pass){
                return NextResponse.json({
                    status: 401,
                    'error': 'Invalid password'
                })
            }

            const tokendata = {
                uid:dbAdmin._id,
                email: dbAdmin.email
            }

            const token = jwt.sign(tokendata,process.env.SECRET_KEY!,{expiresIn: '1d'});

            // Set the token in the response cookies
            const response =  NextResponse.json({
                status: 200,
                message: 'Login successful',
                Admin: {
                    id: dbAdmin._id,
                    name: dbAdmin.name,
                    email: dbAdmin.email
                }
            })
            response.cookies.set('token',token,{
                httpOnly:true
            })

            return response;
        }
    } catch (error) {
        console.error('Failed to login'+error);
        return NextResponse.json({
            status:500,
            message: 'Internal Server Error'
        })
    }
}