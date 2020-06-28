import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

import { Bot } from '@config/bot';

import ITelegrafProvider from '../models/ITelegrafProvider';
import ISendBroadcastDTO from '../dtos/ISendBroadcastDTO';
import ISendBroadcastMediaDTO from '../dtos/ISendBroadcastMediaDTO';

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

  public async sendBroadcastMedia({
    message,
    to: telegramId,
  }: ISendBroadcastMediaDTO): Promise<boolean | number> {
    const { photo, video_note, video } = message.reply_to_message;

    try {
      if (!!photo && !!video_note && !!video)
        throw new Error('Media não identificada');

      const caption = message.text.replace('/media', '').trim();

      if (photo) {
        await this.Bot.telegram.sendChatAction(telegramId, 'upload_photo');
        await this.Bot.telegram.sendPhoto(telegramId, photo[1].file_id, {
          caption,
          parse_mode: 'HTML',
        });
      }
      if (video_note) {
        await this.Bot.telegram.sendChatAction(telegramId, 'upload_video_note');
        await this.Bot.telegram.sendVideoNote(telegramId, video_note.file_id);
      }
      if (video) {
        await this.Bot.telegram.sendChatAction(telegramId, 'upload_video');
        await this.Bot.telegram.sendVideo(telegramId, video.file_id, {
          caption,
          parse_mode: 'HTML',
        });
      }

      return true;
    } catch (error) {
      return telegramId;
    }
  }
}
