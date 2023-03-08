import mongoose from 'mongoose';
import { CONFIG } from '../models/constants';

export class DBConnection {
    constructor() { }

    async connect() { // add async
        console.log('connecting to mongo');
        try {
            await mongoose.connect(CONFIG.MONGOOSEURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('connected to mongo');

        } catch (error) {
            console.log('error during connecting to mongo: ');
            console.error(error);
        }
    }

    async disconnect() { // add async
        console.log('disconnecting to mongo');
        try {
            await mongoose.disconnect();
            console.log("disconnected mongodb");
        } catch (error) {
            console.log('error during connecting to mongo: ');
            console.error(error);
        }
    }
}

export default new DBConnection();
