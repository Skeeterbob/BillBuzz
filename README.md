# BillBuzz
A financial management tool that consolidates all accounts for ease of monitoring.

## Setup: <br>
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
11) Copy the MongoDB master key to the server .env file variable MONGO_MASTER_KEY. <br>
12) Copy this string, "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic" to the server.env file variable ENCRYPTION_ALGORITHM. <br>
13) Set the server .env file variable DATABASE_NAME to "billbuzz". <br>
14) Set the server .env file variable KEY_VAULT_DATABASE to "encryption". <br>
15) Set the server .env file variable USERS_COLLECTION to "userscollection". <br>
16) Set the server .env file variable KEY_VAULT_COLLECTION to "keyVault". <br>
17) Set the server .env file variable QUEUE_COLLECTION to "queuecollection". <br>
18) Create an account on Plaid.
19) Request a developer account on Plaid.
20) Copy the plaid client ID to the server .env file variable PLAID_CLIENT_ID.
21) Copy the plaid secret for the devlopment environment to the server .env file variable PLAID_SECRET.
22) Copy the plaid secret for the sandbox environment to the server .env file variable PLAID_SECRET_SANDBOX.
23) Create a Firebase account.
24) Create a OneSignal account and link it to the firebase account you just created.
25) Copy the OneSignal API key to the server .env file variable ONESIGNAL_API_KEY.
26) Copy the OneSignal App ID to the server .env file variable ONESIGNAL_APP_ID.
27) Setup a tunnel to port 3000 and copy the address into the server .env file variable WEBHOOK_URL.
28) Run npm start command in the terminal from the /server directory. (You should see a message stating that the server is started on port 3000)
29) Open a new terminal.
30) Navigate to the /billBuzzApp/Project directory of the project.
31) Run npm install from the terminal.
32) Create a .env file in the /billBuzzApp/Project directory.
33) Copy the tunnel address into the /billBuzzApp/Project/.env file variable SERVER_ENDPOINT.
34) Create an firewall exception to allow all outgoing traffic on port 443.
35) Run npm start command from the billBuzzApp/Project directory.
