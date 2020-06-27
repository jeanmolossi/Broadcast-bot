import { injectable, inject } from 'tsyringe';

import UserSchema from '@modules/users/infra/typeorm/schemas/UserSchema';

import IUsersRepository from '../repositories/IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    telegramId,
    surname,
    username,
  }: ICreateUserDTO): Promise<UserSchema> {
    const userExists = await this.usersRepository.findByTgId(telegramId);

    if (userExists) return userExists;

    const user = await this.usersRepository.create({
      name,
      telegramId,
      surname,
      username,
    });

    return user;
  }
}
