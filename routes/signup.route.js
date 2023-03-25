const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator') //HTTP 요청에서 입력 데이터를 검증하기 위한 미들웨어
const { Users } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

router.post(
    '/signup',
    [check('email', '이메일 형식이 올바르지 않습니다').isEmail(),
    check('email', '이메일이 필요합니다').notEmpty(),
    check('nickname', '닉네임이 필요합니다').notEmpty(),
    check('password', '비밀번호는 6자 이상 20자 이하로 작성해야 합니다').isLength({ min: 6, max: 20 }),
    check('password', '비밀번호가 필요합니다').notEmpty(),
    check('profileImg', '프로필이미지가 필요합니다').notEmpty(),
    ],
    async (req, res) => {
        // Check if the input data is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password, nickname, profileImg } = req.body;
            // accout가 이미 등록된 상태라면
            let emailData = await Users.findOne({ where: { email } });
            if (emailData) {
                return res.status(400).json({"errorMessage" : "이미 등록된 아이디 입니다"});
            }
            // nickname이 이미 등록된 상태라면        
            let nicknameData = await Users.findOne({ where: { nickname } })
            if (nicknameData) {
                return res.status(400).json({ "errorMessage": '이미 등록된 닉네임 입니다'  });
            }

            // new user 객체 생성과 비밀번호 해싱
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await Users.create({
                email,
                password: hashedPassword,
                nickname,
                profileImg,
            });

            return res.status(201).json({ "message": "회원 가입에 성공하였습니다." });
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('서버 에러입니다')
        }
    }
);

module.exports = router;