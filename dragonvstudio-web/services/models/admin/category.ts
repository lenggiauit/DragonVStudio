import { BaseModel } from "../baseModel";

export type Category = BaseModel & {
    id: any;
    name: any; 
    color: any;
    url: any;
    description: any; 
    isArchived: any;
    totalRows: any;
};