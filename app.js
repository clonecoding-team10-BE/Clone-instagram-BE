const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const globalRouter = require("./routes/index.js");
const app = express();

app.use(
    cors({
        "Access-Control-Allow-Origin": "*",
        credentials: true, //쿠키정책
        optionsSuccessStatus: 200
        //   exposedHeaders: ["token"],
    })
);

app.use(cookieParser())
app.use(express.json());

app.use('/', [globalRouter]);

app.listen(3000, () => {
    console.log(` http://localhost:3000 `);
})