const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { Users } = require('../models');
const authMiddleware = require('../middleware/auth');


router.post(
  '/login',
  [
    check('email', 'email을 작성해주세요').isEmail(),
    check('password', '비밀번호가 필요합니다').exists(),
  ],
  async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 만약 유저가 존재한다면
      const user = await Users.findOne({ where: { email: email } });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: '유저가 존재하지 않습니다' }] });
      }

      // 패스워드가 일치한다면
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: '비밀번호가 일치하지 않습니다' }] });
      }

      
      const payload = {
        user: {
          id: user.userId,
        },
      };
      
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('서버에러가 발생했습니다');
    }
  }
);

module.exports = router;
