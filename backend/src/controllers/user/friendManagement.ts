import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/userModel";
import mongoose from "mongoose";
import { FriendRequestModel } from "../../models/freindRequestModel";
import { RequestStatusEnum } from "../../types/enum";
import { FriendModel } from "../../models/friendModel";

export const sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;
    const { data } = req.body;

    if (!data.recieverId)
        throw new AppError("RecieverId required", 400);

    const receiverExist = await UserModel.exists({ _id: new mongoose.Types.ObjectId(String(data.recieverId)) });
    if (!receiverExist)
        throw new AppError("Reciever not found", 404);

    const newFriendRequested = await FriendRequestModel.create({
        sender: userId,
        receiver: data.recieverId,
        note: data.note ?? "",
        video: data.video ?? "",
        // sentAt: Date.now()
    });

    if (!newFriendRequested)
        throw new AppError("Failed to sent request, try again later", 500);

    return res.status(200).json({
        success: true,
        newFriendRequested
    });
}

export const acceptRequestReceived = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;
    const { senderId, status } = req.query;

    if (!senderId || !status)
        throw new AppError("SenderId is required", 400);

    if (![RequestStatusEnum.ACCEPTED, RequestStatusEnum.REJECTED].includes(status as RequestStatusEnum)) {
        throw new AppError("Invalid status provided", 400);
    }


    // update the friend request
    const updateFriendRequest = await FriendRequestModel.findOneAndUpdate(
        {
            sender: new mongoose.Types.ObjectId(String(senderId)),
            receiver: new mongoose.Types.ObjectId(String(userId))
        },
        {
            $set: {
                status
            }
        },
        {
            new: true
        }
    );

    // Handle accept status by creating a new friend record
    if (status === RequestStatusEnum.ACCEPTED) {
        const friend = await FriendModel.create({
            user1: new mongoose.Types.ObjectId(String(senderId)),
            user2: new mongoose.Types.ObjectId(String(userId))
        });

        return res.status(201).json({
            success: true,
            message: "Friend request accepted",
            friend
        });
    }

    // Handle rejected status
    return res.status(200).json({
        success: true,
        message: "Request rejected successfully",
        updateFriendRequest
    });

}

export const getRequestSended = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;

    const data = await FriendRequestModel.aggregate([
        {
            $match: {
                sender: new mongoose.Types.ObjectId(userId),
                status: RequestStatusEnum.PENDING
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "requestSentUser"
            }
        },
        {
            $unwind:"$requestSentUser"
        },
        {
            $project: {
                _id: 0,
                receiverId : "$requestSentUser._id",
                name:"$requestSentUser.name",
                email:"$requestSentUser.email",
                interest:"$requestSentUser.interests",
                note:1,
                video:1
            }
        }
    ]);

    if (!data.length)
        return res.status(204).json({
            success: true,
            message: "Friend request sended not found"
        });

    return res.status(200).json({
        success: true,
        data
    })
}

export const getRequestRecieved = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;

    const data = await FriendRequestModel.aggregate([
        {
            $match: {
                receiver: new mongoose.Types.ObjectId(userId),
                status: RequestStatusEnum.PENDING
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "requestRecievedUser"
            }
        },
        {
            $unwind:"$requestRecievedUser"
        },
        {
            $project: {
                _id: 0,
                senderId:"$requestRecievedUser._id",
                name:"$requestRecievedUser.name",
                email:"$requestRecievedUser.email",
                interest:"$requestRecievedUser.interests",
                note:1,
                video:1
            }
        }
    ]);

    if (!data.length)
        return res.status(204).json({
            success: true,
            message: "Friend recieved not found"
        });

    return res.status(200).json({
        success: true,
        data
    })
}

export const getAllFriends = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;

    const friends = await FriendModel.aggregate([
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
                otherUserId: {
                    $cond: {
                        if: { $eq: ["$user1", userId] },  // If user1 is the given userId
                        then: "$user2",                   // Set otherUserId as user2
                        else: "$user1"                    // Otherwise, set it as user1
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                foreignField: "_id",
                localField: "otherUserId",
                as: "friends"
            }
        },
        {
            $unwind: "$friends"
        },
        {
            $project: {
                _id:0,
                friendId: "$friends._id",
                name: "$friends.name",
                email: "$friends.email",
            }
        }
    ]);

    console.log("Friends", friends);
    if (!friends.length)
        return res.status(204).send();

    return res.status(200).json({
        success: true,
        message: "Friends fetched successfully",
        friends
    })
}

export const unfollowFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user.id;
    const { friendId } = req.query;

    if(!friendId)
        throw new AppError("freindId is required", 400);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deleteFriendRequestPromise = FriendRequestModel.deleteOne(
            {
                $or: [
                    {
                        sender: new mongoose.Types.ObjectId(userId),
                        receiver: new mongoose.Types.ObjectId(String(friendId))
                    },
                    {
                        sender: new mongoose.Types.ObjectId(String(friendId)),
                        receiver: new mongoose.Types.ObjectId(userId)
                    }
                ]
            },
            { session }  
        );

        const deleteFriendPromise = FriendModel.deleteOne(
            {
                $or: [
                    {
                        user1: new mongoose.Types.ObjectId(userId),
                        user2: new mongoose.Types.ObjectId(String(friendId))
                    },
                    {
                        user1: new mongoose.Types.ObjectId(String(friendId)),
                        user2: new mongoose.Types.ObjectId(userId)
                    }
                ]
            },
            { session } 
        );

        const [deleteFriendRequest, deleteFriend] = await Promise.all([deleteFriendRequestPromise, deleteFriendPromise]);

        if (deleteFriendRequest.deletedCount > 0 && deleteFriend.deletedCount > 0) {
            await session.commitTransaction();
            return res.status(200).json({
                success: true,
                message: "Unfollowed successfully."
            });
        } else {
            throw new Error('One of the operations failed, rolling back');
        }
    } catch (error) {
        await session.abortTransaction();
        // console.error('Transaction failed and was rolled back:', error);
        throw new AppError("Failed to unfollow Friend", 500);
    } finally {
        session.endSession();
    }
}

export const withdrawFriendRequest =async(
    req:Request,
    res:Response,
    next: NextFunction
):Promise<Response |void> =>{
    const userId =req.user.id;
    const {receiverId} = req.query;

    if(!receiverId)
        throw new AppError("Receiver is required", 400);

    const deleteRequest = await FriendRequestModel.deleteOne({
        receiver : new mongoose.Types.ObjectId(String(receiverId)),
        sender : new mongoose.Types.ObjectId(userId)
    });
    
    if(!deleteRequest)
        throw new AppError("Receiver not found", 404);

    return res.status(200).json({
        success:true, 
        message:"Request withdrawn successfully"
    });
}
