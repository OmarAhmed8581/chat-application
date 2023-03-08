export enum categoryTypes {
    GPInHouse = 'GP_In_House',
    GPOutBound = 'GP_Out_Bound',
    Consultant = 'Consultant',    
};
export const categoryValues = Object.keys(categoryTypes).map((k: any) => categoryTypes[k]);
