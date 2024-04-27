import { Request, Response } from "express";
import RecruiterModel from "../models/Recruiter";
import bcrypt from "bcryptjs";
import { JWT_SALT, JWT_SECRET } from "../service/jwtSecret";
import { handleMongoError } from "../utils/handleMongoError";
import { generateToken } from "../service/jwtService";
import mongoose, { isValidObjectId } from "mongoose";
import SuperAdminModel from "../models/SuperAdmin";

const register = async (req: Request, res: Response) => {
  // Handle Recruiter registration
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  try {
    // Check if Recruiter already exists
    const existingRecruiter = await RecruiterModel.findOne({ phoneNumber });
    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: "Recruiter already exists with the same phoneNumber.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, JWT_SALT);

    // Create new Recruiter
    const newRecruiter = new RecruiterModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newRecruiter.save();

    return res
      .status(201)
      .json({ success: true, message: "Recruiter registered successfully" });
  } catch (error: any) {
    console.error("Error in Recruiter registration:", error);
    handleMongoError(error, res);
  }
};

const login = async (req: Request, res: Response) => {
  // Handle Recruiter login
  const { phoneNumber, password } = req.body;

  try {
    // Find Recruiter by email
    const Recruiter = await RecruiterModel.findOne({ phoneNumber });
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: `Recruiter not found with ${phoneNumber}`,
      });
    }
    if (Recruiter.isDeactivated) {
      return res.status(403).json({
        success: false,
        message: "Recruiter Is Deactivated, Please contact your Admin.",
      });
    }
    // Verify password
    if (!(await bcrypt.compare(password, Recruiter.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error in user login:", error);
    handleMongoError(error, res);
  }
};

const updateRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    const updateRecruiterDetails = await RecruiterModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Updated Successfully.",
      data: updateRecruiterDetails,
    });
  } catch (error) {
    console.error("Error in updaing recruiter details:", error);
    handleMongoError(error, res);
  }
};

const softDeletedRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    await RecruiterModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return res.status(200).json({
      success: true,
      message: "Recruiter Deleted SuccessFully.",
    });
  } catch (error) {
    console.error("Error in Deleting recruiter:", error);
    handleMongoError(error, res);
  }
};
const deactivatedRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    await RecruiterModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return res.status(200).json({
      success: true,
      message: "Recruiter Deleted SuccessFully.",
    });
  } catch (error) {
    console.error("Error in Deleting recruiter:", error);
    handleMongoError(error, res);
  }
};
const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    const { newPassword } = req.body;
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, JWT_SALT);

    await RecruiterModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

const getAllRecruiter = async (req: Request, res: Response) => {
  try {
    const data = await RecruiterModel.find({ isDeleted: false });
    return res.status(200).json({
      success: true,
      message: "list of all recruiter.",
      data: data,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

const getRecruiterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Recruiter details fetch Successfully.",
      data: Recruiter,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

export const purchaseRecharge = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { adminID, coin } = req.body;
    if (!isValidObjectId(id) || !isValidObjectId(adminID)) {
      return res.status(400).json({
        success: false,
        message: "Either admin id or recruiter id not valid.",
      });
    }
    // Fetch the admin from the database
    const admin = await SuperAdminModel.findById(adminID).session(session);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    // Fetch the user from the database
    const recruiter = await RecruiterModel.findById(id).session(session);
    if (!recruiter) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update admin's coin balance
    admin.coin -= coin;

    // Validate admin's updated coin balance
    if (admin.coin < 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, error: "Insufficient coins in admin account" });
    }

    // Update user's coin balance
    recruiter.coin += coin;

    // Save changes to admin and user
    await admin.save();
    await recruiter.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message:
        "Recharged Requested Successfully. It will be reflect with 10 min.",
    });
  } catch (error) {
    console.error("Error in rechargeUser controller:", error);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const reCruiterController = {
  register,
  login,
  updateRecruiter,
  softDeletedRecruiter,
  getAllRecruiter,
  getRecruiterById,
  changePassword,
  deactivatedRecruiter,
  purchaseRecharge,
};
