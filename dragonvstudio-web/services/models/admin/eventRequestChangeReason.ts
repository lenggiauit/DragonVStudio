import { BaseModel } from "../baseModel";
import { EventBookingDate } from "./eventBookingDate";

export type EventRequestChangeReason = BaseModel & {
    id: any; 
    reason: any;
    eventBookingDate : EventBookingDate;
};