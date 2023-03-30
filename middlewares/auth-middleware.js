const jwt = require("jsonwebtoken")
const env = process.env
const { Users } = require("../models");


module.exports = async (req, res, next) => {
    try {
        // const authorization = req.headers.authorization;
        const { authorization } = req.cookies;
        console.log("Authorization : ", authorization)
        const [authType, authToken] = (authorization ?? "").split(" ")
        console.log("authType : ", authType, "authToken : ", authToken)
        // console.log(authType,":", authToken)

        if (authType !== "Bearer" || !authToken) {
            res.status(403).json({ "errorMessage": "로그인이 필요한 기능입니다" })
        }
        const { nickname } = jwt.verify(authToken, env.MYSQL_SECRETKEY)
        const user = await Users.findOne({ where: { nickname: nickname } })
        res.locals.user = user;
        next();

    } catch (err) {
        return res.status(400).json({ "errorMessage": err.message })
    }

}