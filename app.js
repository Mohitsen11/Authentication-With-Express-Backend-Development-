require('dotenv').config();
const express = require('express');
const authRouter = require('./Authentication-With-Express-Backend-Development-/routes/authRoute');
const dbConnection = require('./Authentication-With-Express-Backend-Development-/config/databaseConnection');
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials : true
}))
app.use('/api/auth' , authRouter);

app.use('/' , (req , res) => {
    res.status(200).json({
        data: "JWTAuth Server"
    });
});

module.exports = app;