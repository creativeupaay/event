import { Model, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  gender: string;
  email: string;
  number: string;
  tags: string[];
}

// Schema for the Users database
const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
} as const);

// model for the user
export const EmployeeModel: Model<IUser> = model<IUser>("User", UserSchema);
