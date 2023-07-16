const { Users } = require('../models');

class UsersRepository {
  findUser = async (nickname) => {
    const findUser = await Users.findOne({ where: { nickname } });
    return findUser;
  };

  createUser = async ({ nickname, password }) => {
    return await Users.create({ nickname, password });
  };
}

module.exports = UsersRepository;