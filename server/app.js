const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const usersRouter = require("./routes/users.route");
const itemsRouter = require("./routes/items.route");
const messagesRouter = require("./routes/messages.route");
const uploadRouter = require("./routes/upload.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/upload", uploadRouter);

app.use(`/api/uploads`, express.static(config.uploadsDir));

module.exports = app;
