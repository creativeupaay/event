import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError";
import { EventModel } from "../../models/event";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { UserModel } from "../../models/userModel";


export const getAllEventGuest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {

    const { name, sortOrder, eventId, selectedInterest } = req.query;
    const userId = req.user.id;

    if (!eventId)
        throw new AppError("Query(eventId) not found", 400);

    const filteredSelectedInterest = Array.isArray(selectedInterest)
        ? selectedInterest.filter((item: any) => item.trim() !== "")
        : [];

    let selectedInterestLength = filteredSelectedInterest.length;
    console.log("selectedInterestLength");

    const user = await UserModel.aggregate([
        {
            $project: {
                _id: 0,
                interests: 1
            }
        }
    ]);

    const userInterest = user[0].interests;

    const eventGuests = await EventModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(String(eventId)),
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "attendies",
                as: "users"
            }
        },
        {
            $addFields: {
                users: {
                    $map: {
                        input: "$users",
                        as: "user",
                        in: {
                            _id: "$$user._id",
                            name: "$$user.name",
                            email: "$$user.email",
                            gender: "$$user.gender",
                            interestsMatchedCount: {
                                $size: {
                                    $setIntersection: ["$$user.interests", userInterest]
                                }
                            },
                            interests: "$$user.interests"
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                users: {
                    $filter: {
                        input: "$users",
                        as: "user",
                        cond: {
                            $and: [
                                { $ne: ["$$user._id", new mongoose.Types.ObjectId(userId)] },
                                {
                                    $cond: {
                                        if: { $gt: [selectedInterestLength, 0] },
                                        then: {
                                            $gt: [
                                                { $size: { $setIntersection: ["$$user.interests", selectedInterest] } },
                                                0
                                            ]
                                        },
                                        else: true
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $sort: {
                "users.interestsMatchedCount": -1
            }
        },
        {
            $match: {
                ...(name ? { "users": { $elemMatch: { name: { $regex: name, $options: 'i' } } } } : {}),

            }
        },
        {
            $sort: { "users.createdAt": sortOrder === 'asc' ? 1 : -1 }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                users: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    gender: 1,
                    interests: 1,
                    // interestsMatchedCount: 1,
                },
            }
        }
    ]);

    if (!eventGuests.length)
        throw new AppError("Events not available", StatusCodes.NO_CONTENT);

    return res.status(200).json({
        success: true,
        eventGuests
    });
}