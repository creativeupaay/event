import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError";
import { EventModel } from "../../models/event";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { UserModel } from "../../models/userModel";
import { FriendRequestModel } from "../../models/freindRequestModel";
import { FriendModel } from "../../models/friendModel";


export const getAllEventGuest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {

    const { name, sortOrder, eventId, selectedInterest, profession, position, industry, limit = 10, cursor } = req.query;
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

    // connected users
    const connectedUsers = await FriendModel.aggregate([
        {
            $match: {
                $or: [
                    { user1: new mongoose.Types.ObjectId(userId) },
                    { user2: new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                otherUserIds: {
                    $cond: {
                        if: { $eq: ["$user1", new mongoose.Types.ObjectId(userId)] },
                        then: "$user2",
                        else: "$user1"
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

    const connectedUsersIds = connectedUsers && connectedUsers.length > 0 ? connectedUsers[0].otherUserIds : [];
    const pendingRequestUserIds = data && data.length > 0 ? data[0].otherUserIds : [];

    const knownUserIdsArray = [
        ...(pendingRequestUserIds),
        ...(connectedUsersIds)
    ];

    const knownUserIds = [...new Set(knownUserIdsArray)];

    // extracting user interests
    const user = await UserModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
            $project: {
                _id: 0,
                profession: 1,
                position: 1,
                company: 1,
                instituteName: 1,
                courseName: 1,
                industry: 1,
                lookingFor: 1
            }
        }
    ]);
    const lookingFor = user[0].lookingFor;

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
                            interests: "$$user.interests",
                            profileImage: "$$user.profileImage",
                            profession: "$$user.profession",
                            position: "$$user.position",
                            company: "$$user.company",
                            industry: "$$user.industry",
                            instituteName: "$$user.instituteName",
                            courseName: "$$user.courseName",
                            lookingFor: "$$user.lookingFor",
                            createdAt: "$$user.createdAt",
                            lookingForMatchedCount: {
                                $size: {
                                    // $setIntersection: ["$$user.interests", lookingFor]
                                    $setIntersection: [
                                        {
                                            $setUnion: [
                                                { $ifNull: [{ $split: ["$$user.profession", ","] }, []] },
                                                { $ifNull: [{ $split: ["$$user.position", ","] }, []] }
                                            ]
                                        },
                                        lookingFor
                                    ]
                                }
                            },
                            professionMatchCount: {
                                $cond: {
                                    if: { $eq: ["$$user.profession", user[0].profession ?? "NA"] },
                                    then: 1,
                                    else: 0
                                }
                            },
                            positionMatchCount: {
                                $cond: {
                                    if: { $eq: ["$$user.position", user[0].position ?? "NA"] },
                                    then: 1,
                                    else: 0
                                }
                            },
                            instituteNameMatchCount: {
                                $cond: {
                                    if: { $eq: ["$$user.instituteName", user[0].instituteName ?? "NA"] },
                                    then: 1,
                                    else: 0
                                }
                            },
                            companyNameMatchCount: {
                                $cond: {
                                    if: { $eq: ["$$user.company", user[0].company ?? "NA"] },
                                    then: 1,
                                    else: 0
                                }
                            },
                            courseNameMatchCount: {
                                $cond: {
                                    if: { $eq: ["$$user.courseName", user[0].courseName ?? "NA"] },
                                    then: 1,
                                    else: 0
                                }
                            },
                            isNameMatch: name ? { $regexMatch: { input: "$$user.name", regex: name, options: "i" } } : true,
                            isProfessionMatch: profession ? { $regexMatch: { input: "$$user.profession", regex: profession, options: "i" } } : true,
                            isPositionMatch: position ? { $regexMatch: { input: "$$user.position", regex: position, options: "i" } } : true,
                            // isIndustryMatch: industry ? { $regexMatch: { input: "$$user.industry", regex: industry, options: "i" } } : true,
                            isIndustryMatch: industry ? {
                                $gte: [
                                    {
                                        $size: {
                                            $setIntersection: ["$$user.industry", industry]
                                        }
                                    },
                                    1
                                ]
                            } : true
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                users: {
                    $map: {
                        input: "$users",
                        as: "user",
                        in: {
                            $mergeObjects: [
                                "$$user",
                                {
                                    totalMatchCount: {
                                        $add: [
                                            { $ifNull: ["$$user.lookingForMatchedCount", 0] },
                                            { $ifNull: ["$$user.professionMatchCount", 0] },
                                            { $ifNull: ["$$user.positionMatchCount", 0] },
                                            { $ifNull: ["$$user.instituteNameMatchCount", 0] },
                                            { $ifNull: ["$$user.companyNameMatchCount", 0] },
                                            { $ifNull: ["$$user.courseNameMatchCount", 0] }
                                        ]
                                    }
                                }
                            ]
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
                                                { $size: { $setIntersection: ["$$user.lookingFor", selectedInterest] } },
                                                0
                                            ]
                                        },
                                        else: true
                                    }
                                },
                                { $eq: ["$$user.isNameMatch", true] },
                                { $eq: ["$$user.isProfessionMatch", true] },
                                { $eq: ["$$user.isPositionMatch", true] },
                                { $eq: ["$$user.isIndustryMatch", true] },
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                users: {
                    $sortArray: {
                        input: "$users",
                        sortBy: {
                            "totalMatchCount": -1,
                            "createdAt": sortOrder === 'asc' ? 1 : -1
                        }
                    }
                }
            }
        },
        {
            $unwind: "$users"
        },
        ...(cursor ? [
            {
                $match: {
                    "users._id": { $gt: new mongoose.Types.ObjectId(String(cursor)) }
                }
            }
        ] : []),
        {
            $limit: parseInt(String(limit))
        },
        {
            $project: {
                _id: "$users._id",
                name: "$users.name",
                industry: "$users.industry",
                interests: "$users.interests",
                profileImage: "$users.profileImage",
                profession: "$users.profession",
                position: "$users.position",
                company: "$users.company",
                instituteName: "$users.instituteName",
                courseName: "$users.courseName",
                lookingFor: "$users.lookingFor",
                matchCount: "$users.totalMatchCount",
            }
        }
    ]);

    if (!eventGuests.length)
        throw new AppError("Events not available", StatusCodes.NO_CONTENT);

    return res.status(200).json({
        success: true,
        eventGuests,
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

export const getAttendiesRole = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { eventId } = req.query;

    if (!eventId)
        throw new AppError("Query not found", 400);

    const attendeeRoles = await EventModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(String(eventId)) }
        },
        {
            $project: {
                _id: 0,
                attendeeRoles: 1
            }
        }
    ]);

    if (!attendeeRoles.length)
        throw new AppError("Roles not found", 404);

    return res.status(200).json({
        success: true,
        attendeeRoles
    });
}

export const searchGuestInEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { name, sortOrder, eventId, selectedInterest, profession, position, industry, limit = 10, cursor } = req.query;
    const userId = req.user.id;

    console.log("name :", name, profession)

    if (!eventId)
        throw new AppError("Query(eventId) not found", 400);

    const filteredSelectedInterest = Array.isArray(selectedInterest)
        ? selectedInterest.filter((item: any) => item.trim() !== "")
        : [];

    let selectedInterestLength = filteredSelectedInterest.length;


    // extracting all connected UserIds
    const data = await FriendModel.aggregate([
        {
            $match: {
                $or: [
                    { user1: new mongoose.Types.ObjectId(userId) },
                    { user2: new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                otherUserIds: {
                    $cond: {
                        if: { $eq: ["$user1", new mongoose.Types.ObjectId(userId)] },
                        then: "$user2",
                        else: "$user1"
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
                lookingFor: 1
            }
        }
    ]);
    const lookingFor = user[0].lookingFor;

    // extracting all users
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
                            interests: "$$user.interests",
                            profileImage: "$$user.profileImage",
                            profession: "$$user.profession",
                            position: "$$user.position",
                            company: "$$user.company",
                            industry: "$$user.industry",
                            instituteName: "$$user.instituteName",
                            courseName: "$$user.courseName",
                            lookingFor: "$$user.lookingFor",
                            isConnected: {
                                $in: ["$$user._id", knownUserIds]
                            },
                            interestsMatchedCount: {
                                $size: {
                                    $setIntersection: [
                                        {
                                            $setUnion: [
                                                { $ifNull: [{ $split: ["$$user.profession", ","] }, []] },
                                                { $ifNull: [{ $split: ["$$user.position", ","] }, []] }
                                            ]
                                        },
                                        lookingFor
                                    ]
                                }
                            },
                            isNameMatch: name ? { $regexMatch: { input: "$$user.name", regex: name, options: "i" } } : true,
                            isProfessionMatch: profession ? { $regexMatch: { input: "$$user.profession", regex: profession, options: "i" } } : true,
                            isPositionMatch: position ? { $regexMatch: { input: "$$user.position", regex: position, options: "i" } } : true,
                            isIndustryMatch: industry ? { $regexMatch: { input: "$$user.industry", regex: industry, options: "i" } } : true,
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
                                // { $not: { $in: ["$$user._id", knownUserIds] } },
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
                                },

                                { $eq: ["$$user.isNameMatch", true] },
                                { $eq: ["$$user.isProfessionMatch", true] },
                                { $eq: ["$$user.isPositionMatch", true] },
                                { $eq: ["$$user.isIndustryMatch", true] },
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                users: {
                    $sortArray: {
                        input: "$users",
                        sortBy: {
                            "interestsMatchedCount": -1,
                            "createdAt": sortOrder === 'asc' ? 1 : -1
                        }
                    }
                }
            }
        },
        {
            $unwind: "$users"
        },
        ...(cursor ? [
            {
                $match: {
                    "users._id": { $gt: new mongoose.Types.ObjectId(String(cursor)) }
                }
            }
        ] : []),
        {
            $limit: parseInt(String(limit))
        },
        {
            $project: {
                _id: "$users._id",
                name: "$users.name",
                industry: "$users.industry",
                interests: "$users.interests",
                profileImage: "$users.profileImage",
                profession: "$users.profession",
                position: "$users.position",
                company: "$users.company",
                instituteName: "$users.instituteName",
                courseName: "$users.courseName",
                lookingFor: "$users.lookingFor",
                matchCount: "$users.interestsMatchedCount",
                isConnected: "$users.isConnected"
            }
        }
    ]);

    if (!eventGuests.length)
        throw new AppError("Events not available", StatusCodes.NO_CONTENT);

    return res.status(200).json({
        success: true,
        eventGuests,
        // knownUserIds
    });
}