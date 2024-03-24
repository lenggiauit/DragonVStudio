import { UserResource } from "./userResource"

export type CommentResource = {
    id: any, 
    content: any, 
    user: UserResource
    createdDate: Date,
    updatedDate?: Date
}