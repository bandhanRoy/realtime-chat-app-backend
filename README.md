# Realtime Stock App Backend
It is the backend of the real time stock application build using node js.
The backend uses alpha vantage api to fetch realtime data for a company.

### Configuration
For running this project a couple of steps of needs to be followed which are as follows


Keys          | Values        | Description   
------------- |-------------  | -------------
PORT          | 8181          | This can be any value this is where your server will start running
PROTOCOL     | http      |     This can be http or https depending on the requirement. If https add CA, KEY, CERT file path
CA | path of the certificate file      |    This is the path of the CA file **wont work until the PROTOCOL is https**   
KEY | path of the certificate file      |    This is the path of the KEY file **wont work until the PROTOCOL is https**  
CERTIFICATE | path of the certificate file      |    This is the path of the CERTIFICATE file **wont work until the PROTOCOL is https**  
STOCK_API_KEY | N562JGI1LTUGHBNV      | This is the value that is given by the alpha advantage api to fetch the realtime data 
SALT_ROUND | 10      | This is the no of rounds that is used to generate salt. Should be a number 
JWT_EXPIRY | 60d | This is the expiry time when the token gets expired. Values can be 1d for 1 day or 1h or 1 hour 
JWT_SECRET | some_secret      | This is the secret key by which token gets signed in 
DB_HOST | localhost      |   The host of the database
DB_PORT | 27107      |   The port of the database  
DB_NAME | stock_market      |   The database name  
DB_USERNAME | DB username      |  The database user name can be empty ''  
DB_PASSWORD | DB password     |   The database password can be empty ''  

2. If database is mongo cloud then the connection path needs to be changed. DB connection path `src/db/db-conn.js`. Comment out the old connString path and uncomment the the commented connString.

### Available scripts
In this project you can run `npm start`. This will start the node js server on the port that is mentioned on the **.env** file.

You can also run the `npm run dev:server`. This will run your application in development mode on the port that is mentioned on the **.env** file

`npm test` will run the unit test cases for this project.
