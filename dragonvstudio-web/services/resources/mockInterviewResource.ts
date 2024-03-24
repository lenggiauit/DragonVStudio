import { EventBookingDateResource } from "./eventBookingDateResource";
import { EventRequestChangeReasonResource } from "./eventRequestChangeReasonResource";

export type MockInterviewResource =
{
    id  : any,
    fullName  : any, 
    email  : any, 
    ageRange  : any, 
    fullname: any, 
    language: any,
    resume: any,
    coverLetter: any,
    jobDescription: any,  
    note: any,
    eventBookingDateId: any
    eventBookingDate? : EventBookingDateResource,  
    eventStatus  : any,
    isEnableRequestChange: boolean,
    isEnableDelete: boolean,
    eventRequestChangeReason: EventRequestChangeReasonResource
    code: any,
    redeemCode: any,
}