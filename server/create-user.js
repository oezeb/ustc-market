const help = `
Usage: node create-user.js [options]
Description:
    Creates an user in the database
Options:
    -u, --username      [required]
    -p, --password      [required]
    -n, --name          [optional]
    -h, --help          Show this help message
`;

const args = process.argv.slice(2); // get command line arguments

let username, password, name;
for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case "-u":
        case "--username":
            username = args[++i];
            break;
        case "-p":
        case "--password":
            password = args[++i];
            break;
        case "-n":
        case "--name":
            name = args[++i];
            break;
        case "-h":
        case "--help":
        default:
            console.log(help);
            process.exit(0);
    }
}

if (!username || !password) {
    console.log(help);
    process.exit(1);
}

const mongoose = require("mongoose");
const config = require("./config");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

mongoose
    .connect(config.MONGODB_URI)
    .then(async () => {
        new User({
            username,
            password: await bcrypt.hash(password, 10),
            name,
        })
            .save()
            .then((user) => {
                console.log(`User created with ID: ${user._id}`);
                process.exit(0);
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
