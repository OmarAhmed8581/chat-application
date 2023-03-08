export enum Role {
    SuperAdmin = 'super admin',
    Doctor = 'doctor',
    User = 'user'
};
export const RoleValues = Object.keys(Role).map((k: any) => Role[k]);
