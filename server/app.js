const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const loginRouter = require('./routes/login.route');
const profileRouter = require('./routes/profile.route');
const usersRouter = require('./routes/users.route');
const itemsRouter = require('./routes/items.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', loginRouter);
app.use('/api/profile', profileRouter);
app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);

module.exports = app