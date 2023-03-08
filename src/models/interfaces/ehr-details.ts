export interface ICustomerDetails {
    name: string,
    email: string,
    phone: string,
    healthId: string,
    registration: string,
    age: number,
    gender: string,
    height: string,
    weight: string,
}

export interface ISymptoms {
    name: string,
    duration: string,
}

export interface IPastMedical {
    name: string,
    duration: string,
}

export interface IDiagnosis {
    name: string,
}

export interface IPrescription {
    serialNo: number,
    medicine: string,
    dosage: string,
    route: string,
    frequency: string,
    duration: string,

}

export interface IScheduleInfoForAppointment {
    date: string,
    startTime: Date,
    endTime: Date,
}

export interface ILabTest {
    name: string,
}