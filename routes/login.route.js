const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { Users } = require('../models');
const env = process.env


router.post(
  '/login',
  [
    check('email', 'email을 작성해주세요').isEmail(),
    check('password', '비밀번호가 필요합니다').exists(),
  ],
  async (req, res) => {
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
        return res.status(400).json({ "errorMessage": '유저가 존재하지 않습니다' });
      }

      // 패스워드가 일치하지 않는다면
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ "errorMessage": '비밀번호가 일치하지 않습니다' });
      }

      const token = jwt.sign({ nickname: user.nickname }, env.MYSQL_SECRETKEY);
      res.cookie("authorization", `Bearer ${token}`);

      res.status(200).json({ "message": "로그인에 성공하였습니다." })

    } catch (err) {
      console.error(err.message);
      res.status(500).send('서버에러가 발생했습니다');
    }
  }
);

module.exports = router;
