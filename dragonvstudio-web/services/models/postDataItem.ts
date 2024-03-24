import { BaseModel } from "./baseModel";
import { Category } from "./admin/category";

export type PostDataItem = BaseModel & {
    id: any;
    title: any; 
    thumbnail: any;
    url: any;
    shortDescription: any; 
    content: any;
    category: Category;
};