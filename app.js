const express = require("express");
const cors = require("cors");
var path = require('path');
const logger = require("./config/logger.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const globalRouter = require("./routes/index.js");
const app = express();

app.use(
    cors({
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true, //쿠키정책
        optionsSuccessStatus: 200
        //   exposedHeaders: ["token"],
    })
);

app.use(cookieParser())
app.use(express.json());

app.use(express.static(path.join(__dirname,'uploads'))) //정적파일을 프론트에서 사용할수있게 해주는 미들웨어
app.use('/', [globalRouter]);

//에러핸들링 미들웨어
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    err.message = err.message || '예상치 못한 에러가 발생하였습니다.'
  
    logger.error(err.stack)
    res.json({errormessage : err.message});
})

app.listen(3000, () => {
    logger.info(` http://localhost:3000 `);
})