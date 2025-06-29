import nodemailer from 'nodemailer';


interface SendEmailParams {
  email: string; 
}

export const sendEmail = async ({email}: SendEmailParams,OTP:string) => {
  try {
    // Convert userid to string before hashing
    // const verificationToken = await bcrypt.hash(userid.toString(), 10);
    
    // Update the user depending on the email type
    // if (emailType === "RESET") {
    //   await User.findByIdAndUpdate(userid, {
    //     forgotPasswordToken: verificationToken,
    //     forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiration
    //   });
    // }

    // console.log("User with updated OTP"+User.OTP)
    
    
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
        <div style='color:blue; font-size:30px;'><span classname="font-bold text-blue-600">ProGenie</span> - An AI based job MatchMaker</div>
        <p>OTP verification for Account Creation</p>
        <br>
        <p style='color:green; font-weight:bold'>OTP:${OTP}</p>
        <p style='color-red; font-size:15px;'>Note:OTP expires after 10 mins</>
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
