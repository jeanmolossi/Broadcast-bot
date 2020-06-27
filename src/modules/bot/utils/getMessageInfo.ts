import { TelegrafContext } from 'telegraf/typings/context';
import { IncomingMessage } from 'telegraf/typings/telegram-types';

export default (context: TelegrafContext): IncomingMessage => {
  let { message } = context;
  if (!message) message = context.update.message;
  if (!message) message = context.update.callback_query.message;

  return message;
};
