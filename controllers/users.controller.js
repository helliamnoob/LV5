const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  signUp = async (req, res) => {
      const { nickname, password } = req.body;
      const createUser = await this.usersService.signUp(
        nickname,
        password
      );

      res.status(200).json({ createUser });

  };

  login = async (req, res) => {
    try {
      const { nickname, password } = req.body;
      console.log(req.body)
      const { token } = await this.usersService.login({
        nickname,
        password,
      });
      res.cookie('Authorization', `Bearer ${token}`);
      res.status(200).json({ token });
    } catch (error) {

      res.status(401).json({ message: '에러가 발생했습니다.' });
    }
  };

}

module.exports = UsersController;