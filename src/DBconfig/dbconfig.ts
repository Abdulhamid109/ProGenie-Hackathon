import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Database connected successfully");
        });
        connection.on("error", (err) => {
            console.error("Database connection error:", err);
        });
        return NextResponse.json(
            {
                status: 200,
                message: "Database connected successfully"
            }
        )
    } catch (error) {
        console.error("Error connecting to the database:", error);
        return NextResponse.json(
            {
                status: 500,
                message: "Internal Server Error: Unable to connect to the database."
            }
        )
    }
}