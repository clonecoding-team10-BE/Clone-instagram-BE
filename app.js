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
//에러핸들링 미들웨어
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    err.message = err.message || '예상치 못한 에러가 발생하였습니다.'
  
    console.error(err.stack)
    res.json({errormessage : err.message});
})

app.listen(3000, () => {
    console.log(` http://localhost:3000 `);
})