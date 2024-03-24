import { UserResource } from "./userResource";

export type FeedbackResource ={ 
    id: any,
    user: UserResource,
    rating: any,
    isPulished: boolean,
    comment: any,  
    createdDate: any,
    totalRows: any,
}