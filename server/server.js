const mongoose = require("mongoose");

const app = require("./app");
const config = require("./config");
const { transporter } = require("./controllers/auth.controller");

const port = config.PORT || 5000;
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        transporter.verify((err, success) => {
            if (err) return console.log(err);
            console.log("Ready to send emails");
            app.listen(port, () => {
                console.log(`Server is running on port: ${port}`);
            });
        });
    })
    .catch((err) => console.log(err.message));
