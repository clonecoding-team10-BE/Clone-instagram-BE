const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const LoginController = require('../controllers/login.controller');

const loginController = new LoginController();

router.post(
  '/login',
  [
    check('email', '이메일 형식이 올바르지 않습니다').isEmail(),
    check('password', '비밀번호가 필요합니다').notEmpty(),
  ],
  loginController.login);

module.exports = router;
