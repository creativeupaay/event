import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError";
import { EventModel } from "../../models/event";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { UserModel } from "../../models/userModel";
import { FriendRequestModel } from "../../models/freindRequestModel";


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


    // extracting all known UserIds (freind, request sent, request receive)
    const data = await FriendRequestModel.aggregate([
        {
            $match: {
                $or: [
                    { sender: new mongoose.Types.ObjectId(userId) },
                    { receiver: new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                otherUserIds: {
                    $cond: {
                        if: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                        then: "$receiver",
                        else: "$sender"
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                otherUserIds: { $addToSet: "$otherUserIds" }
            }
        },
        {
            $project: {
                _id: 0,
                otherUserIds: 1
            }
        }
    ]);
    const knownUserIds = (data && data[0]?.otherUserIds) ?? [];

    // extracting user interests
    const user = await UserModel.aggregate([
        {
            $project: {
                _id: 0,
                interests: 1
            }
        }
    ]);
    const userInterest = user[0].interests;

    // extracting all unknown users
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
                                { $not: { $in: ["$$user._id", knownUserIds] } },
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
            $unwind: "$users"
        },
        {
            $project: {
                _id:"$users._id",
                name: "$users.name",
                email: "$users.email",
                gender: "$users.gender",
                interests: "$users.interests",
                matchCount :"$users.interestsMatchedCount"
            }
        }
    ]);

    if (!eventGuests.length)
        throw new AppError("Events not available", StatusCodes.NO_CONTENT);

    return res.status(200).json({
        success: true,
        eventGuests,
        knownUserIds
    });
}

export const getUserEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;

    const currentDate = new Date();

    const events = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: "events",
                foreignField: "_id",
                localField: "eventIds",
                as: "events"
            }
        },
        {
            $unwind: "$events"
        },
        {
            $project: {
                _id: 0,
                eventId: "$events._id",
                name: "$events.name",
                description: "$events.description",
                type: "$events.type",
                startDate: "$events.startDate",
                endDate: "$events.endDate",
                venue: "$events.venue",
                city: "$events.city",
                banner: "$events.banner",
                status: {
                    $cond: {
                        if: { $and: [{ $gte: ["$events.endDate", currentDate] }, { $lte: ["$events.startDate", currentDate] }] },
                        then: "ongoing",
                        else: {
                            $cond: {
                                if: { $gt: ["$events.startDate", currentDate] },
                                then: "upcoming",
                                else: "past"
                            }
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                onGoing: {
                    $push: {
                        $cond: [
                            { $and: [{ $gte: ["$endDate", currentDate] }, { $lte: ["$startDate", currentDate] }] },
                            "$$ROOT",
                            null
                        ]
                    }
                },
                upComing: {
                    $push: {
                        $cond: [
                            { $gt: ["$startDate", currentDate] },
                            "$$ROOT",
                            null
                        ]
                    }
                },
                past: {
                    $push: {
                        $cond: [
                            { $lt: ["$endDate", currentDate] },
                            "$$ROOT",
                            null
                        ]
                    }
                }
            }
        },
        {
            $project: {
                onGoing: {
                    $filter: {
                        input: "$onGoing",
                        as: "event",
                        cond: { $ne: ["$$event", null] }
                    }
                },
                upComing: {
                    $filter: {
                        input: "$upComing",
                        as: "event",
                        cond: { $ne: ["$$event", null] }
                    }
                },
                past: {
                    $filter: {
                        input: "$past",
                        as: "event",
                        cond: { $ne: ["$$event", null] }
                    }
                },
                _id: 0
            }
        }
    ]);

    if (!events.length)
        throw new AppError("Event not found", 404);

    return res.status(200).json({
        success: true,
        events
    })
}