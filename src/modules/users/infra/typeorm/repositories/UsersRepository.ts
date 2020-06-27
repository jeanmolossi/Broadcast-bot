import { MongoRepository, getMongoRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import UserSchema from '../schemas/UserSchema';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: MongoRepository<UserSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(UserSchema);
  }

  public async create({
    name,
    telegramId,
    surname,
    username,
  }: ICreateUserDTO): Promise<UserSchema> {
    const newUser = this.ormRepository.create({
      name,
      telegramId,
      surname,
      username,
    });

    await this.ormRepository.save(newUser);

    return newUser;
  }

  public async findAll(): Promise<UserSchema[]> {
    const users = await this.ormRepository.find();

    return users;
  }

  public async findByTgId(telegramId: number): Promise<UserSchema | undefined> {
    const user = await this.ormRepository.findOne({
      where: { telegramId },
    });

    return user || undefined;
  }

  public async removeUserByTgId(telegramId: number): Promise<boolean> {
    const del = await this.ormRepository.deleteOne({
      telegramId,
    });

    if (del.result === 1) return true;

    return false;
  }
}
