import { EventBookingDateResource } from "./eventBookingDateResource";

export type EventRequestChangeReasonResource = { 
    id: any, 
    reason: any,
    eventBookingDate? : EventBookingDateResource,  
};