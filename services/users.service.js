const UsersRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');

class UsersService {
  usersRepository = new UsersRepository();

  signUp = async (nickname,password) => {
    const isExitstUser = await this.usersRepository.findUser(nickname);
    if (isExitstUser) throw new Error("이미 존재하는 아이디 입니다."); 
    const createUser = await this.usersRepository.createUser({
        nickname,
        password,
    });
    return {
        nickname: createUser.nickname,
        password: createUser.password,
      };
  };

  login = async ({ nickname, password }) => {
    const user = await this.usersRepository.findUser(nickname);

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      "customized_secret_key", 
    );

    return { data: '로그인에 성공하였습니다.', token };
  };
}

module.exports = UsersService;