import { connect } from "@/DBconfig/dbconfig";
import user from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

connect();


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;
        const dbuser = await user.findOne({ email });
        console.log(dbuser)
        if (dbuser) {
            return NextResponse.json({
                error: 'User already exists',
            },{status: 400});
        }else{
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newuser = new user({
            name,
            email,
            password: hashed
        });

        const saveduser = await newuser.save();
        

        
        return NextResponse.json(
            { success:true,user:saveduser },
            { status: 200 }
        );
       
    }
    
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error ' + error,
            },{status: 500,}
        )
    }
}