import * as dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'
dotenv.config();
import app from './app';
// import { logger } from './shared/winston-logger';
const PORT = process.env.PORT || 3005;

// import http from 'http'
import https from 'https'

const options = {
    cert: fs.readFileSync(path.resolve('/home/agora-dev', 'certificate', '__itecknologi_com.crt')),
    //ca: fs.readFileSync(path.resolve('/home/agora-dev', 'certificate', '__itecknologi_com.ca-bundle')),
    key: fs.readFileSync(path.resolve('/home/agora-dev','certificate','__itecknologi_com.key'))
    //requestCert: true,
    //rejectUnauthorized: true
};

const server = https.createServer(options, app)
app.io.attach(server, {
    cors: {
        origin: '*',
    }
});
server.listen(443, () => {
    console.log("HTTPS Server running on port 443");
});




// server.listen(PORT, () => {
//     console.log(`Server Listing Port ${PORT}`);
// });
export const basePath = __dirname;
