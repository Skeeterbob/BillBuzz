# BillBuzz
A financial management tool that consolidates all accounts for ease of monitoring.

## Server Setup: <br>
1) Make sure that Node and NPM are installed. <br>
2) Navigate to /server directory of the project in terminal. <br>
3) Run npm install command in terminal. <br>
4) Create .env file in the server directory of project. <br>
5) Create an account with Twilio. <br>
6) Copy the Twilio authorization token to the server .env file variable TWILIO_AUTH_TOKEN. <br>
7) Copy the Twilio account SID to the server .env file variable TWILIO_ACCT_SID. <br>
8) Add your phone number to the server .env file variable TEST_PHONE. <br>
9) Create an account with MongoDB. <br>
10) Replace \<account\> and \<password\> in the string, "mongodb+srv://\<account\>:\<password\>@wsucluster0.3qpwigj.mongodb.net/?retryWrites=true&w=majority" with your new MongoDB login and password respectively, and copy the new string to the server.env file variable MONGO_CONNECTION. <br>
11)
OneSignal REST API Overview: https://documentation.onesignal.com/docs/onesignal-api
***Make sure that port 443 on server is open to outbound traffic so that the api requests for push notifications can get out. ***
Setup tunnel to port 3000 to allow server to accept incoming traffic.
Setup Redis for Kue functionality: https://redis.io/docs/install/install-redis/
