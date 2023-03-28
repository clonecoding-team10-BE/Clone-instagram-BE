const bcrypt = require('bcryptjs');
const CustomError = require('../middlewares/errorhandler');
const SignupRepository = require('../repositories/signup.repository')

class SignupService {
    constructor() {
      this.SignupRepository = new SignupRepository();
    }

  createUser = async ({email, password, nickname, profileImg})=> {
    
    const emailData = await this.SignupRepository.findByEmail({ email } )
    if (emailData) {
      throw new CustomError('이미 등록된 이메일 입니다', 400);
    }
    const nicknameData = await this.SignupRepository.findByNickname({nickname}) 
    if (nicknameData) {
        throw new CustomError("이미 등록된 닉네임 입니다", 400)
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.SignupRepository.createUser({
      email,
      hashedPassword,
      nickname,
      profileImg,
    });
  }


}    


module.exports = SignupService;
