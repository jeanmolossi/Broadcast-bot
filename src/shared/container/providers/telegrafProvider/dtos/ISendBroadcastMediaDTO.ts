import { IncomingMessage } from 'telegraf/typings/telegram-types';

export default interface ISendBroadcastMediaDTO {
  message: IncomingMessage;
  to: number;
}
