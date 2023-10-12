const help = `
Usage: node scripts/reset-user-password.js [options]
Description:
    Reset an user's password in the database
Options:
    -u, --username      [required]
    -p, --password      [optional] default: "password"
    -h, --help          Show this help message
`;

const args = process.argv.slice(2); // get command line arguments

let username, password;
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
        case "-h":
        case "--help":
        default:
            console.log(help);
            process.exit(0);
    }
}

if (!username) {
    console.log(help);
    process.exit(1);
}

const mongoose = require("mongoose");
const config = require("../config");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

mongoose.connect(config.MONGODB_URI).then(async () => {
    User.findOneAndUpdate(
        { username },
        { password: await bcrypt.hash(password || "password", 10) }
    )
        .then((user) => {
            if (!user) {
                console.log(`User ${username} not found`);
                process.exit(1);
            }
            console.log(`User ${username} password reset`);
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
});
