import { EventBookingDateResource } from "../../resources/eventBookingDateResource";
import { UserResource } from "../../resources/userResource";
import { BaseModel } from "../baseModel";
import { EventCancelReason } from "./eventCancelReason";
import { EventRequestChangeReason } from "./eventRequestChangeReason";
 

export type PrivateTalk = BaseModel & {
    id: any;
    fullName  : any, 
    email  : any, 
    ageRange  : any, 
    problem  : any, 
    problemOther  : any, 
    problemDescription  : any, 
    yourSolutionDescription  : any, 
    yourExpectationDescription  : any, 
    eventBookingDate? : EventBookingDateResource, 
    user: UserResource,
    eventRequestChangeReason: EventRequestChangeReason,
    eventCancelReason: EventCancelReason,
    eventStatus  : any,
    isEnableRequestChange: boolean,
    isEnableDelete: boolean,
    totalRows: any,
    code: any,
    redeemCode: any,
    
};
 