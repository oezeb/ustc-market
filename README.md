# Alum Market

Alum Market is a web application, built using the MERN stack, that allows users to buy and sell items. This project was inspired by the need for many international students to sell or give away their items before returning to their home countries.

This project hopes to provide a platform for students to exchange items with each other, and to reduce the amount of waste produced by students who are unable to bring their items back home.

Alum Market will only provide basic functionalities such as user authentication, item listing, and messaging. It will not provide payment services or delivery services. The aim of this project is to help connect buyers and sellers, and to provide a platform for them to communicate and arrange for meetups.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repo
```sh
git clone https://github.com/oezeb/alum-market.git
```
2. Setup [server](./server/README.md#installation)
3. Setup [client](./client/README.md#installation)

## Features

### User Authentication

- [ ] Users can sign in using the university SSO
- [x] No public facing registration page. Admins can create new users if necessary.
- [x] Users can sign in using their username and password
- [x] Users can change basic profile information including password
- [x] Admins can help users reset their passwords

### Item Listing

- [x] Users can create new listings
- [x] Users can edit their own listings
- [x] Users can view all listings

### Messaging

- [x] Messages should be private and encrypted
- [x] Users can send messages to other users regarding a listing
- [x] The owner of a listing cannot initiate a conversation with a user who has not contacted them first about the listing
- [ ] Use socket.io to allow for real-time messaging
- [ ] Users can block other users from contacting them

### Privacy

- [x] Users are anonymous by default
- [x] Including the messaging feature, users can choose to share their contact information privately with other users
