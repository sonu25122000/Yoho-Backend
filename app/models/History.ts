import mongoose from "mongoose";

export interface HistoryDocument extends mongoose.Document {}

export const HistorySchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

const HistoryModel = mongoose.model<HistoryDocument>("History", HistorySchema);

export default HistoryModel;
