import { EventBookingDateResource } from "../../resources/eventBookingDateResource";
import { UserResource } from "../../resources/userResource";
import { BaseModel } from "../baseModel";
import { EventCancelReason } from "./eventCancelReason";
import { EventRequestChangeReason } from "./eventRequestChangeReason";
 

export type MockInterview = BaseModel & {
    id: any;
    fullName  : any, 
    email  : any, 
    ageRange  : any, 
    language  : any, 
    resume  : any, 
    coverLetter  : any, 
    jobDescription  : any, 
    note  : any, 
    eventBookingDate? : EventBookingDateResource, 
    user: UserResource,
    eventRequestChangeReason: EventRequestChangeReason,
    eventCancelReason: EventCancelReason,
    eventStatus  : any,
    isEnableRequestChange: boolean,
    isEnableDelete: boolean,
    totalRows: any; 
    code: any,
    redeemCode: any,
};
 