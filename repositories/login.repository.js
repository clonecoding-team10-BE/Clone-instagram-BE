const { Users } = require('../models');

class UserRepository {
  constructor(){}
  getUserByEmail = async ({email}) => {
    return await Users.findOne({ where: { email: email } });
  }
}

module.exports = UserRepository;
