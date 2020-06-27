import User from '../infra/typeorm/schemas/UserSchema';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findAll(): Promise<User[]>;
  findByTgId(telegramId: number): Promise<User | undefined>;
  removeUserByTgId(telegramId: number): Promise<boolean>;
}
