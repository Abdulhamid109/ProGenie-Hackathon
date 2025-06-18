import { connect } from "@/DBconfig/dbconfig";
import user from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


connect();


export async function POST(request:NextRequest){
    try {
        const body = await request.json();
        const {email,password} = body;
        const dbuser = await user.findOne({email:email});
        if(!dbuser){
            return NextResponse.json({
                status: 404,
                'error': 'User not found'
            })
        }else{
            // password verification logic
            const pass = await bcrypt.compare(password,dbuser.password);
            if(!pass){
                return NextResponse.json({
                    status: 401,
                    'error': 'Invalid password'
                })
            }

            const tokendata = {
                uid:dbuser._id,
                email: dbuser.email
            }

            const token =  jwt.sign(tokendata,process.env.SECRET_KEY!,{expiresIn: '1d'});

            // Set the token in the response cookies
            const response =  NextResponse.json({
                status: 200,
                message: 'Login successful',
                user: {
                    id: dbuser._id,
                    name: dbuser.name,
                    email: dbuser.email
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