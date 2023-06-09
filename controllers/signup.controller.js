const { validationResult } = require('express-validator') //HTTP 요청에서 입력 데이터를 검증하기 위한 미들웨어
const SignupService = require("../services/signup.service.js");
const fs = require("fs");

class SignupController {
    constructor() {
        this.signupService = new SignupService();
    }
    signup = async (req, res, next) => {
        // Check if the input data is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password, nickname } = req.body;
            const profileImg = `/userImg/${req.file.filename}`
            await this.signupService.createUser({ email, password, nickname, profileImg });
            return res.status(201).json({ "message": "회원 가입에 성공하였습니다." });
        } catch (err) {
            //에러발생 시 업로드 취소
            if (req.file) {
                fs.unlinkSync(__dirname + '/../uploads' + `/userImg/${req.file.filename}`);
            }
            return next(err)
        }
    }

}
module.exports = SignupController;