import { injectable, inject } from 'tsyringe';

import ITelegrafProvider from '@shared/container/providers/telegrafProvider/models/ITelegrafProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
export default class SendBroadcastService {
  constructor(
    @inject('TelegrafProvider')
    private telegrafProvider: ITelegrafProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(message: string): Promise<void> {
    const users = await this.usersRepository.findAll();

    users.forEach(async user => {
      const to = user.telegramId;
      const response = await this.telegrafProvider.sendBroadcast({
        message,
        to,
      });
      // IF BIGGER THAN 1 IS A TELEGRAM ID
      if (response > 1) {
        await this.usersRepository.removeUserByTgId(Number(response));
      }
    });
  }
}
