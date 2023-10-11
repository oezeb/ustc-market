# Alum Market Client

This is the client for [Alum Market](../README.md). It is a React application built using [Create React App](https://create-react-app.dev).

## Installation

1. Clone the repo, if you haven't already
```sh
git clone https://github.com/oezeb/alum-market.git
```
2. Install dependencies
```sh
cd client && npm install
```
3. Make sure you have the [server](../server/README.md) running
4. Start the client
```sh
npm start
```

> The server should be reachable using the identical host and port as our React application, with the additional path segment `/api`. For example, if our React application is active at `http://localhost:3000`, the server must be accessible at `http://localhost:3000/api`. During development time, refer to the [Proxying API Requests in Development](https://create-react-app.dev/docs/proxying-api-requests-in-development) documentation by Create React App for more information.
