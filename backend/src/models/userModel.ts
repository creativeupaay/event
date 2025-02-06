import { Model, Schema, model } from "mongoose";
import { AccountStatusEnum, GenderEnum } from "../types/enum";

export interface IUser extends Document {
  name: string;
  email: string;
  gender: GenderEnum;
  contactNumber: string;
  profileImage:string;
  profession:string;
  industry:string;
  company:string;
  lookingFor :string[];
  interests: string[];
  eventIds:Schema.Types.ObjectId[];
  status: AccountStatusEnum;
  refreshToken:string;
  resetPasswordToken:string;
  resetPasswordExpires:Date;
  emailVerified:boolean;
}


const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  gender:{
    type:String,
    enum:Object.values(GenderEnum),
    required:true,
  },
  contactNumber:{
    type:String,
  },
  profileImage:{
    type:String
  },
  profession:{
    type:String,
  },
  industry:{
    type:String,
  },
  company:{
    type:String,
  },
  lookingFor: [
    {
      type: String
    }
  ],
  interests: [
    {
      type: String
    }
  ],
  eventIds:[
    {
      type:Schema.Types.ObjectId,
      ref:"Event",
    }
  ],
  status: {
    type: String,
    enum: Object.values(AccountStatusEnum),
    required: true,
    default: AccountStatusEnum.ACTIVE
  },
  emailVerified:{
    type:Boolean,
    required:true,
    default:false
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

},{
  timestamps:true
});

// model for the user
export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
