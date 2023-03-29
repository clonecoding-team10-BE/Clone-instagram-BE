const { validationResult } = require('express-validator');
const LoginService = require('../services/login.service');
const jwt = require('jsonwebtoken');
const env = process.env

class LoginController {
  constructor() {
    this.loginService = new LoginService();
  }

  login = async (req, res, next) => {
    // Check if the input data is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await this.loginService.remainUser({ email, password });
      // Create a JWT token
      const token = jwt.sign({ nickname: user.nickname }, env.MYSQL_SECRETKEY);
      res.cookie('authorization', `Bearer ${token}`, { expires: new Date(Date.now() + 900000) ,httpOnly: false, secure: false, sameSite: false });
      return res.status(200).json({ message: '로그인에 성공하였습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LoginController;
