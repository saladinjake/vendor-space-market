import { Application } from 'express';
import UserController from '../controlers/user.controller';

export const routes = (app: Application) => {
  app.get('/users', UserController.getAllUsers);
};
