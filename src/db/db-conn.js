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

const connString = `mongodb://${connDet.host}/${connDet.database}`;
// For mongo cloud
// const connString = `mongodb+srv://${connDet.username}:${connDet.password}@${connDet.host}/${connDet.database}?retryWrites=true&w=majority`;

const option = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connection = () => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const MockGoose = require('mockgoose').Mockgoose;
            const mockGoose = new MockGoose(mongoose);
            //
            mockGoose.prepareStorage().then(() => {
                mongoose.connect(connString, option, function (err) {
                    if (err) {
                        console.log(`${dateTimeUtil.getCurrentDateTime()} Unable to connect to the Database:: ${connDet.host} : ${connDet.port} Error: ${err}`);
                        reject(err);
                    } else {
                        console.log(`${dateTimeUtil.getCurrentDateTime()} Database successfully connected from:: ${connDet.host} : ${connDet.port}`);
                        resolve();
                    }
                })
            });
        } else {
            mongoose.connect(connString, option, function (err) {
                if (err) {
                    console.log(`${dateTimeUtil.getCurrentDateTime()} Unable to connect to the Database:: ${connDet.host} : ${connDet.port} Error: ${err}`);
                    reject(err);
                } else {
                    console.log(`${dateTimeUtil.getCurrentDateTime()} Database successfully connected from:: ${connDet.host} : ${connDet.port}`);
                    resolve();
                }
            });
        }

    })
}

function close() {
    return mongoose.disconnect();
}


module.exports = {
    connection: connection,
    close: close
}