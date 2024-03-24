import { BaseModel } from "../baseModel";
import { Category } from "./category";
import { Tag } from "../tag";

export type BlogPost = BaseModel & {
    id: any;
    title: any;   
    thumbnail: any;
    category: Category;
    tags: Tag[];
    url: any;
    shortDescription: any; 
    content: any;
    isPublic: any;
    isDraft: any;
    isArchived: any;
    view: any;
    totalRows: any;
    
};