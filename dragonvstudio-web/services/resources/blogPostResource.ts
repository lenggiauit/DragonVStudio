import { CategoryResource } from "./categoryResource";
import { TagResource } from "./tagResource";
import { UserResource } from "./userResource";

 
export type BlogPostResource = {
    title: any,
    thumbnail: any,
    shortDescription: any,
    content: any,
    url: any,
    view: any,
    comment: any,
    user: UserResource,
    category: CategoryResource,
    tags: TagResource[],
    totalRows: any,
    createdDate: Date,
    updatedDate?: Date
}

export type BlogPostRelatedResource = {
    title: any, 
    url: any, 
}
 