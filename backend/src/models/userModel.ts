import { Model, Schema, model } from "mongoose";
import { AccountStatusEnum, GenderEnum } from "../types/enum";

export interface IUser extends Document {
  name: string;
  email: string;
  contactNumber: string;
  profileImage: string;
  profession: string;
  position: string;
  industry: string[];
  help: string[];                                        
  company: string;
  instituteName: string;
  courseName:string;
  lookingFor: string[];
  interests: string[];
  eventIds: Schema.Types.ObjectId[];
  status: AccountStatusEnum;
  refreshToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  emailVerified: boolean;
}


const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true
  },
  contactNumber: {
    type: String,
    trim:true,
  },
  profileImage: {
    type: String
  },
  profession: {
    type: String,
    trim:true
  },
  position: {
    type: String,
    trim:true
  },
  industry: [
    {
      type: String,
      trim:true
    }
  ],
  help: [
    {
      type: String,
      trim:true,
    }
  ],
  company: {
    type: String,
    trim:true
  },
  instituteName: {
    type: String,
    trim:true
  },
  courseName:{
    type:String,
    trim:true
  },
  lookingFor: [
    {
      type: String,
      trim:true
    }
  ],
  interests: [
    {
      type: String,
      trim:true
    }
  ],
  eventIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    }
  ],
  status: {
    type: String,
    enum: Object.values(AccountStatusEnum),
    required: true,
    default: AccountStatusEnum.ACTIVE
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  refreshToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },

}, {
  timestamps: true
});

// model for the user
export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
