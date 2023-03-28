const express = require('express');
const router = express.Router();
const {check} = require('express-validator') //HTTP 요청에서 입력 데이터를 검증하기 위한 미들웨어
const SignupController = require('../controllers/signup.controller.js');
const signupController = new SignupController();


router.post(
    '/signup',
    [check('email', '이메일 형식이 올바르지 않습니다').isEmail(),
    check('email', '이메일이 필요합니다').notEmpty(),
    check('nickname', '닉네임이 필요합니다').notEmpty(),
    check('nickname', '닉네임은 1자 이상 10자 이하로 작석해야 합니다').isLength({min:1, max:10}),
    check('password', '비밀번호는 6자 이상 20자 이하로 작성해야 합니다').isLength({ min: 5, max: 20 }),
    check('password', '비밀번호가 필요합니다').notEmpty(),
    check('profileImg', '프로필이미지가 필요합니다').notEmpty(),
    ],
    signupController.signup);
    
module.exports = router;