import mongoose from "mongoose";

export interface RecruiterDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  isDeactivated?: boolean;
}

export const RecruiterSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    isDeactivated: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const RecruiterModel = mongoose.model<RecruiterDocument>(
  "Recruiter",
  RecruiterSchema
);

export default RecruiterModel;
