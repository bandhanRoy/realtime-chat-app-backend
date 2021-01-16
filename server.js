require('dotenv').config();
const http = require('http');
const app = require('./app');
const dateTimeUtil = require('./src/utils/date-util');

let protocol;
let protocol_options;

if (process.env.PROTOCOL == 'https') {
    protocol = require('https');
    protocol_options = {
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERTIFICATE),
        ca: fs.readFileSync(process.env.CA)
    };
} else {
    protocol = require('http');
    protocol_options = {};
}

const server = protocol.createServer(protocol_options, app)

server.listen(process.env.PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    // console.log(cluster, numOfCPUs);
    console.log(`${dateTimeUtil.getCurrentDateTime()} Server listening to http://${host}:${port}`);
});