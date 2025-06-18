import { connect } from "@/DBconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import Admin from "@/models/adminmodal";

connect();


export async function POST(request:NextRequest){
    try {
        const body = await request.json();
        const {name,email,password} = body;
        const dbAdmin = await Admin.findOne({email});
        if(dbAdmin){
            return NextResponse.json({
                status: 409,
                error: 'Admin already exists'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt);
        const newAdmin = new Admin({
            name,
            email,
            password:hashed
        });

        const savedAdmin = await newAdmin.save();
        return NextResponse.json({
            status: 201,
            message: 'Admin created successfully',
            Admin: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email
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