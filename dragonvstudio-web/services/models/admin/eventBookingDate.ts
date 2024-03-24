import { BaseModel } from "../baseModel";
import { User } from "../user";

export type EventBookingDate = BaseModel & {
    id: any,
    title : any,
    eventName?: any,
    user?: User
    start: any,  
    end: any,  
};