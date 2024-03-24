import { BaseModel } from "./baseModel";

export type Tag = BaseModel & {
    id: any;
    name: any;  
    url: any; 
    isPublic: any;
};