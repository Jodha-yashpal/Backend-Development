import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    medicalCondition: [
        {
            type: String
        }
    ]
}, {timestamps: true})

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)