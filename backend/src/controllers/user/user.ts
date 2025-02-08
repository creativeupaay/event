import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/userModel";
import { EventModel } from "../../models/event";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwtUtils";
import { Roles } from "../../types/applicationRole";
import { imageUploader } from "../../utils/imageUploader";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { data } = req.body;
  if (!data.eventId || !data.name || !data.email || !data.gender)
    throw new AppError("Feild not found", 400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    data.eventIds = [data.eventId];
    data.profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${data.name}`;
    const [user] = await UserModel.create([data], { session });
    if (!user) throw new AppError("Failed to create new User", 500);

    const updatedEvent = await EventModel.findByIdAndUpdate(
      data.eventId,
      { $push: { attendies: user._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    let accessToken = generateAccessToken({
      id: String(user._id),
      role: Roles.USER,
    });
    let refreshToken = generateRefreshToken({
      id: String(user._id),
      role: Roles.USER,
    });

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user,
      // updatedEvent,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(error.message, 500);
  }
};

export const UserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = req.user.id;

  console.log("userId", userId);

  const user = await UserModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        gender: 1,
        profileImage: 1,
        contactNumber: 1,
        status: 1,
        interests: 1,
      },
    },
  ]);

  if (!user.length) throw new AppError("User not found", 404);

  return res.status(200).json({
    success: true,
    user: user[0],
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { data } = req.body;
  const userId = req.user.id;

  const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
  if (!user) throw new AppError("User not found", 404);

  return res.status(200).json({
    success: true,
    message: "user profile updated",
    user,
  });
};

export const updateInterest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = req.user.id;
  const { data } = req.body;

  if (!data.interestsToRemove.length && !data.newInterests.length)
    throw new AppError("Field not found", 400);

  if (data.interestsToRemove.length) {
    const removedInterest = await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      {
        $pull: { interests: { $in: data.interestsToRemove } },
      },
      { new: true }
    );
  }

  if (data.newInterests.length) {
    const updatedInterest = await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $push: { interests: { $each: data.newInterests } } },
      { new: true }
    );
  }

  const updatedInterest = await EventModel.findById(
    new mongoose.Types.ObjectId(userId)
  )
    .lean()
    .select("interests");

  return res.status(200).json({
    success: true,
    updatedInterest,
  });
};

export const updateLookingFor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = req.user.id;
  const { data } = req.body;

  if (!data.lookingForToRemove.length && !data.newLookingFor.length)
    throw new AppError("Field not found", 400);

  if (data.lookingForToRemove.length) {
    await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      {
        $pull: { lookingFor: { $in: data.lookingForToRemove } },
      },
      { new: true }
    );
  }

  if (data.newLookingFor.length) {
    await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $push: { lookingFor: { $each: data.newLookingFor } } },
      { new: true }
    );
  }

  const updatedlookinFor = await UserModel.findById(
    new mongoose.Types.ObjectId(userId)
  )
    .lean()
    .select("lookingFor");

  return res.status(200).json({
    success: true,
    updatedlookinFor,
  });
};

export const editProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = req.user.id;

  if (!req.file) throw new AppError("No file uploaded", 400);

  const imageUrl = await imageUploader(req.file);
  if (!imageUrl) throw new AppError("Failed to upload Image", 500);

  const updatedProfile = await UserModel.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    {
      $set: {
        profileImage: imageUrl,
      },
    },
    { new: true }
  );

  if (!updatedProfile) throw new AppError("Image not updated", 500);

  return res.status(200).json({
    sucess: true,
    profileImage: updatedProfile.profileImage,
  });
};
