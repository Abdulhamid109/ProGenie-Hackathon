import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    location: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    EmailVerified: { 
        type: Boolean, 
        default: false 
    },
    CourseName: { 
        type: String 
    },
    Spealization: { 
        type: String 
    },
    ColleageName: { 
        type: String 
    },
    GradingSystem: {
        type: String,
        enum: ["GPA", "CGPA", "Percentage"],
        // Note: description is not a valid Mongoose schema option
        // Use comments or documentation instead
    },
    phoneno: {
        type: String,
        unique: true
    },
    Score: {
        type: String,
        // Note: description is not a valid Mongoose schema option
        // Use comments or documentation instead
        // Valid ranges: GPA(0-4), CGPA(0-10), Percentage(0-100)
    },
    StartYear: { 
        type: String 
    },
    EndYear: { 
        type: String 
    },
    Type: {
        type: String, // Fixed: was "tyep" instead of "type"
        enum: ["Regular", "Part-Time"],
    },
    resumelink: {
        type: String,
        required: true,
    },
    Notification: {
        type: Boolean,
        default: false
    },
    resumecleantext: {
        type: String,
    },
    AppliedJobs: [
        {
            appliedjobID: {
                type: String,
            },
            similarityScore: {
                type: Number,
            },
            appliedbool: {
                type: Boolean,
                default: false
            }
        }
    ],
    ShortlistedJobs: [
        {
            shortlistedjobID: {
                type: String,
            },
            similarityScore: {
                type: Number, // Changed from String to Number for consistency
            }
        }
    ],
}, {
    timestamps: true // Optional: adds createdAt and updatedAt fields
});


const ProfileData = mongoose.models.profiledata || mongoose.model("profiledata", profileSchema);

export default ProfileData;