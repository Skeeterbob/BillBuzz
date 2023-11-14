# BillBuzz
A financial management tool that consolidates all accounts for ease of monitoring.

Server Setup:
Make sure that Node and NPM are installed.
Navigate to /server directory.
Run npm install.
OneSignal REST API Overview: https://documentation.onesignal.com/docs/onesignal-api
***Make sure that port 443 on server is open to outbound traffic so that the api requests for push notifications can get out. ***
Setup tunnel to port 3000 to allow server to accept incoming traffic.
Setup Redis for Kue functionality: https://redis.io/docs/install/install-redis/
