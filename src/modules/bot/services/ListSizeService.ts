import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ListSizeService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<number> {
    const users = await this.usersRepository.findAll();

    return users.length;
  }
}
