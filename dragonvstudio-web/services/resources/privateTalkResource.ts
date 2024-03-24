import { EventBookingDateResource } from "./eventBookingDateResource";
import { EventRequestChangeReasonResource } from "./eventRequestChangeReasonResource";

export type PrivateTalkResource =
{
    id  : any,
    fullName  : any, 
    email  : any, 
    ageRange  : any, 
    problem  : any, 
    problemOther  : any, 
    problemDescription  : any, 
    yourSolutionDescription  : any, 
    yourExpectationDescription  : any, 
    eventBookingDate? : EventBookingDateResource,  
    eventStatus  : any,
    isEnableRequestChange: boolean,
    isEnableDelete: boolean,
    code: any,
    redeemCode: any,
    eventRequestChangeReason: EventRequestChangeReasonResource
}