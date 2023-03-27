const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomError = require("../middlewares/errorhandler.js")
const { check, validationResult } = require('express-validator');
const { Users } = require('../models');
const env = process.env


router.post(
  '/login',
  [
    check('email', 'email을 작성해주세요').isEmail(),
    check('password', '비밀번호가 필요합니다').exists(),
  ],
  async (req, res ,next) => {
    //req값 validation 체크 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // 만약 유저가 존재하지 않는다면
      const user = await Users.findOne({ where: { email: email } });
      if (!user) {
        throw new CustomError("유저가 존재하지 않습니다", 400)
      }

      // 패스워드가 일치하지 않는다면
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new CustomError("비밀번호가 일치하지 않습니다", 400)
      }

      const token = jwt.sign({ nickname: user.nickname }, env.MYSQL_SECRETKEY);
      res.cookie("authorization", `Bearer ${token}`);

      res.status(200).json({ "message": "로그인에 성공하였습니다." })

    } catch (err) {
      next(err)
    }
  }
);

module.exports = router;
