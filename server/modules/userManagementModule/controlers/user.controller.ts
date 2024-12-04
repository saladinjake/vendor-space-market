import { Request, Response } from 'express';
import UserService from '../services/user.services';

class UserController {
  static getAllUsers(req: Request, res: Response) {
    UserService.getAllUsers()
      .then(users => res.json(users))
      .catch(err => res.status(500).json({ error: err.message }));
  }
}

export default UserController;
