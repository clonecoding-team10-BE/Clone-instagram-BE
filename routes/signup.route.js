const express = require('express');
const multer = require('multer')
var path = require('path');
const router = express.Router();
const { check } = require('express-validator') //HTTP 요청에서 입력 데이터를 검증하기 위한 미들웨어
const SignupController = require('../controllers/signup.controller.js');
const signupController = new SignupController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/userImg/')  //uploads/userImg라는 폴더에 저장할꺼다
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
})
const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    console.log(typeArray)
    const fileType = typeArray[1];

    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
        req.fileValidationError = null;
        cb(null, true);
    } else {
        req.fileValidationError = "jpg,jpeg,png파일만 업로드 가능합니다.";
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

router.post(
    '/signup',
    upload.single('profileImg'),
    [check('email', '이메일 형식이 올바르지 않습니다').isEmail(),
    check('email', '이메일이 필요합니다').notEmpty(),
    check('nickname', '닉네임이 필요합니다').notEmpty(),
    check('nickname', '닉네임은 1자 이상 10자 이하로 작석해야 합니다').isLength({ min: 1, max: 10 }),
    check('password', '비밀번호는 6자 이상 20자 이하로 작성해야 합니다').isLength({ min: 5, max: 20 }),
    check('password', '비밀번호가 필요합니다').notEmpty()
    ],
    signupController.signup);

module.exports = router;