import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userID:{
        type:String,
        required: true,
    },
    gender:{
        enum:["Male","Female","Other"],
        type:String,
    },
    location:{
        type:String,
    },
    DOB:{
        type:Date,
    },
    EmailVerified:{type:Boolean,default:false},
    CourseName:{type:String},
    Spealization:{type:String},
    ColleageName:{type:String},
    GradingSystem:{
        enum:["GPA","CGPA","Percentage"],
        type:String,
        description:"GPA(0-4),CGPA(0-10),Percentage(0-100)",
    },
    phoneno:{
        type:String,
        unique:true
    },
    Score:{
        type:String,
        description:"GPA(0-4),CGPA(0-10),Percentage(0-100)",
    },
    StartYear:{type:String},
    EndYear:{type:String},
    Type:{
        enum:["Regular","Part-Time"],
        tyep:String,
    },
    resumelink:{
        type:String,
        required: true,
    },
    Notification:{
        type:Boolean,
        default:false
    },
    resumecleantext:{
        type:String,
    },
    AppliedJobs:[
        {
            appliedjobID: {
                type: String,
                
            },
            similarityScore: {
                type: String,
            }
        }
    ],
    ShortlistedJobs:[
        {
            shortlistedjobID: {
                type: String,
                
            },
            similarityScore: {
                type: String,
            }
        }
    ],
});

const ProfileData = mongoose.models.profiledata || mongoose.model("profiledata",profileSchema);
export default ProfileData;