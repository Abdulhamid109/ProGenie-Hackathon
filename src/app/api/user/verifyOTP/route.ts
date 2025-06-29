import { connect } from "@/DBconfig/dbconfig";
import user from "@/models/userModal";
import { redis } from "@/redis";
import { NextRequest, NextResponse } from "next/server";

// Connect to MongoDB
connect();

// Define the expected shape of Redis data
interface ParsedData {
  name: string;
  email: string;
  hashed: string;
  otp: string;
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { email, otp } = req;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Retrieve from Redis
    const tempData = await redis.get(`signup:${email}`);
    if (!tempData) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Log raw Redis data for debugging
    console.log("Raw Redis data:", tempData);
    console.log("Type of tempData:", typeof tempData);

    // Handle different data types from Redis
    let parsedData: ParsedData;
    try {
      // If tempData is already an object, use it directly
      if (typeof tempData === 'object' && tempData !== null) {
        parsedData = tempData as ParsedData;
      } 
      // If it's a string, parse it
      else if (typeof tempData === 'string') {
        parsedData = JSON.parse(tempData);
      } 
      // If it's something else, try to stringify then parse
      else {
        const stringified = String(tempData);
        if (stringified === '[object Object]') {
          throw new Error('Invalid data format: received [object Object]');
        }
        parsedData = JSON.parse(stringified);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw data that failed to parse:", tempData);
      await redis.del(`signup:${email}`); // Clean up invalid data
      return NextResponse.json(
        { error: "Invalid data format in Redis" },
        { status: 400 }
      );
    }

    // Validate parsed data structure
    if (!parsedData.name || !parsedData.email || !parsedData.hashed || !parsedData.otp) {
      console.error("Missing required fields in parsed data:", parsedData);
      await redis.del(`signup:${email}`); // Clean up invalid data
      return NextResponse.json(
        { error: "Corrupted data in Redis" },
        { status: 400 }
      );
    }

    // Verify OTP (case-insensitive comparison)
    if (parsedData.otp.toLowerCase() !== otp.toLowerCase()) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check for duplicate email in MongoDB
    const existingUser = await user.findOne({ email: parsedData.email });
    if (existingUser) {
      await redis.del(`signup:${email}`); // Clean up Redis
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const newUser = new user({
      name: parsedData.name,
      email: parsedData.email,
      password: parsedData.hashed,
      accountverification: true,
    });

    const savedUser = await newUser.save();

    // Delete from Redis
    await redis.del(`signup:${email}`);

    // Return minimal user data
    return NextResponse.json({
      success: "Successful OTP verification...redirecting to homepage",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}