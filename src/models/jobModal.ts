import mongoose from "mongoose";

const jobModal = new mongoose.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    jobrole: {
        type: String,
        required: true
    },
    jobdescription: {
        type: String,
        required: true
    },
    jobExperience: {
        type: String,
        required: true
    },
    jobVacancy: {
        type: Number,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    jobSalary: {
        type: String,
        required: true
    },

    jobSkills: {
        type: String,
        required: true
    },
    AboutCompany: {
        type: String,
        required: true
    },
    adminID: {
        type: String,
        required: true
    },
    shortlistedCandidates: [
        {
            shortlisteduserID: {
                type: String,
                // unique: true,
                
            },
            similarityScore: {
                type: String,
            }
        }
    ],
    jobcleantext: {
        type: String,
    },
    Appliedcandiates: [
        {
            applieduserID: {
                type: String,
                // unique: true,
            },
            similarityScore: {
                type: String,
            }
        }
    ]

});

const jobmodal = mongoose.models.jobs || mongoose.model('jobs', jobModal);
export default jobmodal; 