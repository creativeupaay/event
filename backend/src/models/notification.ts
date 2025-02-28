import { Model, Schema, model } from "mongoose";
import { NotificationEnum } from "../types/enum";

export interface INotification extends Document {
    userId: Schema.Types.ObjectId,
    type: NotificationEnum;                           // request recived,accepted, 
    message: string;
    isRead: boolean;
    reference?: Schema.Types.ObjectId
}

const NotificationSchema: Schema<INotification> = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationEnum), 
    },
    message: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default:false
    },
    reference: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
},{
    timestamps:true
});

export const NotificationModel : Model<INotification> = model<INotification>("Notification", NotificationSchema);