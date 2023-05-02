const bcrypt = require('bcryptjs');
const CustomError = require('../middlewares/errorhandler');
const UserRepository = require('../repositories/login.repository');


class LoginService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  remainUser = async ({email, password}) => {
    // Find the user with the given email
    console.log(email)
    const user = await this.userRepository.getUserByEmail({email});
    if (!user) {
      throw new CustomError('유저가 존재하지 않습니다', 401);
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError('비밀번호가 일치하지 않습니다', 401);
    }

    return user;
  }
}

module.exports = LoginService;
