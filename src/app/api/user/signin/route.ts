import { connect } from "@/DBconfig/dbconfig";
import user from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

connect();


export async function POST(request:NextRequest){
    try {
        const body = await request.json();
        const {name,email,password} = body;
        const dbuser = await user.findOne({email});
        if(dbuser){
            return NextResponse.json({
                status: 409,
                error: 'User already exists'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt);
        const newuser = new user({
            name,
            email,
            password:hashed
        });

        const saveduser = await newuser.save();
        return NextResponse.json({
            status: 201,
            message: 'User created successfully',
            user: {
                id: saveduser._id,
                name: saveduser.name,
                email: saveduser.email
            }
        });
    } catch (error) {
        return NextResponse.json(
            {
                status:500,
                error:'Internal server error '+error,

            }
        )
    }
}