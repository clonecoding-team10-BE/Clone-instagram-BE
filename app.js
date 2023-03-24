const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const globalRouter = require("./routes/index.js");
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use('/', [globalRouter]);

app.listen(3000, () => {
    console.log(` http://localhost:3000 `);
})