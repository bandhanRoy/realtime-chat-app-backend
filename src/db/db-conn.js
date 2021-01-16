require('dotenv').config();
const mongoose = require('mongoose');
const connDet = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME
}
const dateTimeUtil = require('./../utils/date-util');

const connection = () => {
    let connString = '';
    if (connDet.host === 'localhost') {
        //for Localhost node server DB
        connString = `mongodb://${connDet.host}/${connDet.database}`;
    } else {
        //for server DB
        connString = `mongodb://${connDet.username}:${connDet.password}@${connDet.host}:${connDet.port}/${connDet.database}?authSource=admin`;
    }

    const option = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    mongoose.connect(connString, option, function (err) {
        if (err) {
            console.log(`${dateTimeUtil.getCurrentDateTime()} Unable to connect to the Database:: ${connDet.host} : ${connDet.port} Error: ${err}`);
        } else {
            console.log(`${dateTimeUtil.getCurrentDateTime()} Database successfully connected from:: ${connDet.host} : ${connDet.port}`);
        }
    });
}


module.exports = {
    connection: connection
}