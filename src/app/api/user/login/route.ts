import { connect } from "@/DBconfig/dbconfig";
import User from "@/models/userModal";
import { NextRequest ,NextResponse} from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextRequest) {
    try {
        const req = await request.json();
        const {email,password} = req;
        //check if user exists or not
        const ispresent = await User.findOne({email});
        console.log(ispresent);
        
        if(!ispresent){
            console.log("User not found ,Signup");
            return NextResponse.json(
                {error:"Acount does not exists"},
                {status:404}
            )
        }
        
        //check the credentails
        const result = await bcrypt.compare(password,ispresent.password);
        console.log(result);
        console.log("db password"+ispresent.password);
        console.log("user password"+password);
        console.log(ispresent._id);
        
        if(result==false){
           return NextResponse.json(
            {error:'invalid credentails'},
            {status:400}
           )
        }else{
            //jwt setup
        const tokenData = {
            id:ispresent._id,
            name : ispresent.name,
            email:ispresent.email
        }
        const token = jwt.sign(tokenData,process.env.USER_SECRET_KEY!,{expiresIn:'1d'});

        //cookies setup
        const response =  NextResponse.json(
            {message:"Successfull login"},
            {status:200}
        );
        response.cookies.set('usertoken',token,{
            httpOnly:true//so that the user cannot manipulate it
        });
        
        return response;
        }
        
    } catch (error) {
        console.log("Something went wrong!!"+String(error));
        return NextResponse.json(
            {error:"Something went wrong!!"},
            {status:500}
        )
        
    }
}