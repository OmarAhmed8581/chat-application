import { loadEnvs } from '../../shared';
import { EnvironmentName, EnvironmentNameValues } from '../enums/environment-name';
/* loadEnvs takes an array of environment variables and loads them into an object.
*  By Default, it will throw an error if any of them are missing.
*  You can disable the error by passing false as the second argument.
*  In this case, it will log a warning for each missing environment variables.
*  This way, you can easily see which variables you can set in the logs.
*/

const getEnvironmentName = (NAME: string) => {
    switch (NAME) {
        case EnvironmentName.Production: return EnvironmentName.Production;
        case EnvironmentName.Stage: return EnvironmentName.Stage;
        case EnvironmentName.Test: return EnvironmentName.Test;
        case EnvironmentName.Local: return EnvironmentName.Local;
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + EnvironmentNameValues);
    }
};

const configEnvs = loadEnvs([
    'BCRYPT_SALT_ROUNDS',
    'BCRYPT_REHASH_DATE'
], false);

let BCRYPT_REHASH_DATE;
try {
    if (BCRYPT_REHASH_DATE) BCRYPT_REHASH_DATE = new Date(configEnvs['BCRYPT_REHASH_DATE']);
} catch (e) {
    // logger.error(`BCRYPT_REHASH_DATE not a valid date: ${BCRYPT_REHASH_DATE}`);
}

export const CONFIG = {
    //  MONGOOSEURI: 'mongodb+srv://root:root@cluster0.wqbpt.mongodb.net/vocalsDB?retryWrites=true&w=majority',
    MONGOOSEURI: 'mongodb://localhost:27017/iteknology',	// local server mongodb+srv://furqaninvestkaar:InvestKaar007@cluster0.c5hgy.mongodb.net/test?authSource=admin&replicaSet=atlas-pmbxle-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true
    // MONGOOSEURI: 'mongodb+srv://furqaninvestkaar:InvestKaar007@cluster0.c5hgy.mongodb.net/investkaar',
    // SERVER_ALERT_CONTACTS: serverAlertContacts
    // SFTP_ALERT_CONTACTS: sftpAlertContacts,	
    
    // IMAGEBASEURL: 'http://localhost:3005',  // local
    
    AGORAAPPID: 'b13672329cf6403d96d90e744d44c3d1',
    AGORACERTIFICATE: '91f57db8f9f84d6988b894c222fee776',



    TAGAUDIODIR: 'taggedAudios',
    UNTAGAUDIODIR: 'untaggedAudios',
    VIDEODIR: 'videos',
    FILEDIR: 'files',
    IMAGEDIR: 'images',
    imageExtensions: ['.jpg', '.png', '.jpeg'],
    videoExtensions: ['.mp4', '.avi', '.mpg', '.mov'],
    audioExtensions: ['.mp3','.wav'],
    fileExtensions: ['.pdf', '.doc', '.docx', '.xlsx', '.csv'],
    exportFileTypeExtensions: ['pdf', 'xlsx', 'csv'],

    // IMAGEBASEURL: 'https://swinging-api.appnofy.com',  // staging http://3.16.172.190:3002/v1
    // IMAGEBASEURL: 'http://3.16.172.190:3005',  // live http://23.20.51.167:3002/
    IMAGEBASEURL: 'http://124.29.233.117:80',  // prod
    IMAGEURLNAME: '/static',
    STATIC_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InJvbGUiOiJ1c2VyIiwidXNlcklkIjoiNWY1Yjk0YTY2YTNjYTMwMDA0YzJjZWJiIn0sImlhdCI6MTU5OTgzOTMwMiwiZXhwIjoxNjAwMDk4NTAyfQ.Fdft4zwZwOzww6Fdbk2t4UiTz1cpNSrIYrzsvddXh1U',
    mutliGETRouteModules: ['message', 'conversation', 'agora'],
    mutliPOSTRouteModules: ['message', 'conversation', 'agora'],
    BCRYPT_SALT_ROUNDS:10, //+configEnvs['BCRYPT_SALT_ROUNDS'] || 10,
    BCRYPT_REHASH_DATE: BCRYPT_REHASH_DATE || new Date("2019-11-26"),
    APPLICATION_EXPIRY_DAYS: 14,
    ROOT_FILE: "server",
    Android_Client_ID: '783813945994-eiemn5r3g76j97o0f3il0soenlghlgj6.apps.googleusercontent.com',
	IOS_Client_ID: '783813945994-gjeel82ggfln1ent1buhn42ok42c7sdk.apps.googleusercontent.com',
	Web_Client_ID: '783813945994-56bch5nl25p9mge7510vpo384r6u03dh.apps.googleusercontent.com',
    MAIL: {
        HOST: '175.107.196.14',
        PORT: 587,
        EMAIL_FROM: 'demo.app@salaamtakaful.com',
        PASSWORD: 'D@app@#$129!',
    },
    ENVIRONMENT_CONFIG: loadEnvironmentConfig(EnvironmentName.Test || EnvironmentName.Local),
    ENVIRONMENT_NAME: getEnvironmentName(EnvironmentName.Test || EnvironmentName.Local)
};

function loadEnvironmentConfig(NAME: string): {
    ADMIN_URL: string, // admin-client
    CLIENT_URL: string, // client
} {
    switch (NAME) {
        case EnvironmentName.Production:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case EnvironmentName.Stage:
            return {
                ADMIN_URL: '',
                CLIENT_URL: '',
            };
        case EnvironmentName.Test:
            return {
                ADMIN_URL: 'http://localhost:3005',
                CLIENT_URL: 'http://localhost:3005',
            };
        case EnvironmentName.Local:
            return {
                ADMIN_URL: 'http://localhost:3005',
                CLIENT_URL: 'http://localhost:3005',
            };
        default:
            throw new Error('Invalid Environment Name given. Must be one of: ' + EnvironmentNameValues);
    }
}