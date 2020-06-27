import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

import { Bot } from '@config/bot';

import ITelegrafProvider from '../models/ITelegrafProvider';
import ISendBroadcastDTO from '../dtos/ISendBroadcastDTO';

export default class TelegrafProvider implements ITelegrafProvider {
  private Bot: Telegraf<TelegrafContext>;

  private tgIdsFailure: number[];

  constructor() {
    this.Bot = Bot;
    this.tgIdsFailure = [];
  }

  public async sendBroadcast({
    message,
    to: telegramId,
  }: ISendBroadcastDTO): Promise<boolean | number> {
    try {
      await this.Bot.telegram.sendChatAction(telegramId, 'typing');

      await this.Bot.telegram.sendMessage(telegramId, message);

      return true;
    } catch (error) {
      return telegramId;
    }
  }
}
