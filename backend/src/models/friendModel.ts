// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const FriendshipSchema: Schema = new Schema({
//   user1: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   user2: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   establishedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Friendship', FriendshipSchema);




import { Model, Schema, model } from "mongoose";
import { RequestStatusEnum } from "../types/enum";

export interface IFriends extends Document {
  user1:Schema.Types.ObjectId,
  user2:Schema.Types.ObjectId,
}

const FriendSchema : Schema<IFriends> = new Schema<IFriends>({
  user1:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  user2:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true,
  }
},{
  timestamps:true
});

export const FriendModel : Model<IFriends> = model<IFriends>("Friend", FriendSchema);

