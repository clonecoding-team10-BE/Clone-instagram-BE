const { Users } = require('../models');

class SignupRepository {
    constructor() {}
  
    findByEmail = async ({email}) => {
      return await Users.findOne( { where : {email} } );
    }
  
    findByNickname= async  ({nickname}) =>  {
      return await Users.findOne({where : {nickname}});
    }
  
   createUser= async ({email,hashedPassword,nickname,profileImg}) => {
      return await Users.create({
        email,
        password : hashedPassword,
        nickname,
        profileImg})
    }
  }
  
  module.exports = SignupRepository;
  