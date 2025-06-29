import { connect } from "@/DBconfig/dbconfig";
import user from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { sendEmail } from "@/helpers/otpmail";
import { OTPGenerator } from "@/helpers/OTPgenerator";
import { redis } from "@/redis";

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
            }, { status: 400 });
        } else {
            // OTP generation
            const OTP = OTPGenerator();
            // email verification stuff
            await sendEmail({ email }, OTP);
            // temp data storeage
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const tempData = {
                name,
                email,
                hashed,
                otp:OTP,
                createdAt: new Date().toISOString(),
            };

            await redis.setex(`signup:${email}`, 600, JSON.stringify(tempData));
                console.log("Stored in Redis:", JSON.stringify(tempData));
            return NextResponse.json(
                { success: true, user: "OTP successfully sent" },
                { status: 200 }
            );

        }

    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error ' + error,
            }, { status: 500, }
        )
    }
}