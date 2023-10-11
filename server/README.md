# Alum Market Server

This is the server for [Alum Market](../README.md). It is a REST API built using Node.js and Express.js.

## Installation

1. Clone the repo, if you haven't already
```sh
git clone https://github.com/oezeb/alum-market.git
```
2. Install dependencies
```sh
cd server && npm install
```
3. Create a `.env` file in the root directory of the project, and add the following environment variables:
```sh
PORT=5000
MONGODB_URI=<your mongodb uri>
MONDODB_TEST_URI=<mongodb uri for testing>
JWT_SECRET=<your jwt secret>
ENCRYPTION_KEY=<your encryption key>
ENCRYPTION_IV=<your encryption iv>
ENCRYPTION_ALGORITHM=aes-256-cbc
```
4. Start the server
```sh
npm start
```
