const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const loginRouter = require('./routes/login.route');
const userRouter = require('./routes/user.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', loginRouter);
app.use('/api/user', userRouter);

module.exports = app