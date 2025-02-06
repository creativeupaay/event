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


    // const data = await FriendRequestModel.aggregate([
    //         {
    //             $match: {
    //                 $or:[
    //                     {sender: new mongoose.Types.ObjectId(userId)},
    //                     {receiver : new mongoose.Types.ObjectId(userId)}
    //                 ]
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "users",
    //                 localField: "sender",
    //                 foreignField: "_id",
    //                 as: "requestRecievedUser"
    //             }
    //         },
    //         {
    //             $unwind:"$requestRecievedUser"
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 senderId:"$requestRecievedUser._id",
    //                 name:"$requestRecievedUser.name",
    //                 email:"$requestRecievedUser.email",
    //                 interest:"$requestRecievedUser.interests",
    //                 note:1,
    //                 video:1
    //             }
    //         }
    //     ]);

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



    // const eventGuests = await EventModel.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(String(eventId)),
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             foreignField: "_id",
    //             localField: "attendies",
    //             as: "users"
    //         }
    //     },
    //     {
    //         $addFields: {
    //             users: {
    //                 $map: {
    //                     input: "$users",
    //                     as: "user",
    //                     in: {
    //                         _id: "$$user._id",
    //                         name: "$$user.name",
    //                         email: "$$user.email",
    //                         gender: "$$user.gender",
    //                         interestsMatchedCount: {
    //                             $size: {
    //                                 $setIntersection: ["$$user.interests", userInterest]
    //                             }
    //                         },
    //                         interests: "$$user.interests"
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $addFields: {
    //             users: {
    //                 $filter: {
    //                     input: "$users",
    //                     as: "user",
    //                     cond: {
    //                         $and: [
    //                             { $ne: ["$$user._id", new mongoose.Types.ObjectId(userId)] },
    //                             {
    //                                 $cond: {
    //                                     if: { $gt: [selectedInterestLength, 0] },
    //                                     then: {
    //                                         $gt: [
    //                                             { $size: { $setIntersection: ["$$user.interests", selectedInterest] } },
    //                                             0
    //                                         ]
    //                                     },
    //                                     else: true
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $sort: {
    //             "users.interestsMatchedCount": -1
    //         }
    //     },
    //     {
    //         $match: {
    //             ...(name ? { "users": { $elemMatch: { name: { $regex: name, $options: 'i' } } } } : {}),

    //         }
    //     },
    //     // {
    //     //     $lookup: {
    //     //         from: "friendrequests",
    //     //         let: { userId: new mongoose.Types.ObjectId(userId), friends: "$users" },
    //     //         pipeline: [
    //     //             {
    //     //                 $unwind:"$$friends"
    //     //             },
    //     //             {
    //     //                 $match: {
    //     //                     $or: [
    //     //                         {
    //     //                             $and: [
    //     //                                 { sender: { $eq: "$$userId" } },
    //     //                                 { receiver: { $eq: "$$friends._id" } }
    //     //                             ]
    //     //                         },
    //     //                         {
    //     //                             $and: [
    //     //                                 { sender: { $eq: "$$friends._id" } },
    //     //                                 { receiver: { $eq: "$$userId" } }
    //     //                             ]
    //     //                         }
    //     //                     ]
    //     //                 }
    //     //             },
    //     //         ],
    //     //         as: "friendReq"
    //     //     }
    //     // },
    //     {
    //         $lookup: {
    //           from: "friendrequests",
    //           let: { userId: new mongoose.Types.ObjectId(userId), friends: "$friends" }, // Assuming friends is an array of objects
    //           pipeline: [
    //             {
    //               $addFields: {
    //                 friendsMatchingRequest: {
    //                   $filter: {
    //                     input: "$$friends", 
    //                     as: "friend", 
    //                     cond: {
    //                       $and: [
    //                         { $eq: ["$$userId", "$$friend.sender"] },
    //                         {  $eq: ["$$friend.receiver", "$$userId"] }
    //                         // {
    //                         //   $and: [
    //                         //     { $eq: ["$$userId", "$$friend.sender"] }, // If the user is the sender
    //                         //     { $eq: ["$$friend.receiver", "$$userId"] } // and the friend is the receiver
    //                         //   ]
    //                         // },
    //                         // {
    //                         //   $and: [
    //                         //     { $eq: ["$$userId", "$$friend.receiver"] }, // If the user is the receiver
    //                         //     { $eq: ["$$friend.sender", "$$userId"] } // and the friend is the sender
    //                         //   ]
    //                         // }
    //                       ]
    //                     }
    //                   }
    //                 }
    //               }
    //             },
    //             {
    //               $match: {
    //                 friendsMatchingRequest: { $ne: [] } // Match if there are any matching requests
    //               }
    //             }
    //           ],
    //           as: "friendReq"
    //         }
    //       },                
    //     // {
    //     //     $match:{
    //     //         "friendReq" :{$size : 0}
    //     //     }
    //     // },
    //     {
    //         $sort: { "users.createdAt": sortOrder === 'asc' ? 1 : -1 }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             name: 1,
    //             users: {
    //                 _id: 1,
    //                 name: 1,
    //                 email: 1,
    //                 gender: 1,
    //                 interests: 1,
    //                 // interestsMatchedCount: 1,
    //             },
    //             friendReq: 1,
    //         }
    //     }
    // ]);


    if (!eventGuests.length)
        throw new AppError("Events not available", StatusCodes.NO_CONTENT);

    return res.status(200).json({
        success: true,
        eventGuests
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