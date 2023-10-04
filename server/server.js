const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config({ path: './.env' });

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`)
        })
    })
    .catch(err => console.log(err.message))
