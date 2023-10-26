# USTC Market Server

This is the server for [USTC Market](../README.md). It is a REST API built using Node.js and Express.js.

## Installation

1. Clone the repo, if you haven't already
```sh
git clone https://github.com/oezeb/ustc-market.git
```
2. Install dependencies
```sh
cd server
npm install
```
3. Set the following environment variables:
```sh
# SERVER
DOMAIN=<your domain> # used when sending verification or password reset emails
PORT=<server port> # optional, defaults to 5000

# DATABASE
MONGODB_URI=<your mongodb uri>
MONDODB_TEST_URI=<mongodb uri for testing>

# JWT TOKEN for authentication
JWT_SECRET=<your jwt secret>
JWT_LIFETIME=<jwt lifetime in seconds>


# TEXT ENCRYPTION
ENCRYPTION_KEY=<your encryption key>
ENCRYPTION_IV=<your encryption iv>
ENCRYPTION_ALGORITHM=aes-256-cbc

# EMAIL
EMAIL_HOST=<your email host>
EMAIL_PORT=<your email port>
EMAIL_SECURE=<true or false>
EMAIL_USER=<your email user>
EMAIL_PASSWORD=<your email password>
```
> Can also create a `.env` file in the root directory of the project, and add the above environment variables there.
4. Start the server
```sh
npm start
```
