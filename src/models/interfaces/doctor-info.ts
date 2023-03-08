export interface IExperience {
    companyName: string,
    startDate: Date,
    endDate: Date,
    currently: Boolean,
    position: string
}

export interface IEducationalInfo {
    institute: string,
    degree: string,
    year: Date
}

export interface IScheduleInfo {
    day: string,
    timeSlots: [{
        startTime: Date,
        endTime: Date,
    }]

}

export interface IScheduleInfoForAppointment {
    date: string,
    startTime: Date,
    endTime: Date,
}