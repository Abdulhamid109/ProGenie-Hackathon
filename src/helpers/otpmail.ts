import nodemailer from 'nodemailer';
import { OTPGenerator } from '@/helpers/OTPgenerator';
import { getUserTokenData } from './getUserTokenData';
import { NextRequest} from 'next/server';
import user from '@/models/userModal';

interface SendEmailParams {
  email: string; 
}

export const sendEmail = async ({email}: SendEmailParams,request:NextRequest) => {
  try {
    // Convert userid to string before hashing
    // const verificationToken = await bcrypt.hash(userid.toString(), 10);
    const OTP = OTPGenerator();
    // Update the user depending on the email type
    // if (emailType === "RESET") {
    //   await User.findByIdAndUpdate(userid, {
    //     forgotPasswordToken: verificationToken,
    //     forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiration
    //   });
    // }
    const userid = await getUserTokenData(request);
    const User = await user.findOneAndUpdate({_id:userid},{OTP:OTP});
    console.log("User with updated OTP"+User.OTP)
    
      // Configure nodemailer
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "870a46b658c123",
        pass: "8c0eb8d04caba1",
      },
    });

    // Define email options
    const mailOptions = {
      from: 'abdulhamidpatel109@gmail.com',
      to: email,
      subject: "Confirm Your Account",
      html: `
        <p>Hello Dear,</p><br>
        <div classname='flex justify-center items-center w-full font-semibold'><span classname="font-bold text-blue-600">ProGenie</span> - An AI based job MatchMaker</div>
        <p>OTP verification for Account Creation</p>
        <br>
        <p classname='bg-red-400 font-semibold'>OTP:${OTP}</p>
      `,
    };

    // Send email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
    } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};
