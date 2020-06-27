import 'reflect-metadata';
import { container } from 'tsyringe';
import Extra from 'telegraf/extra';
import fs from 'fs';

import { Bot, config } from '@config/bot';
import CreateUserService from '@modules/users/services/CreateUserService';

import getMessageInfo from './utils/getMessageInfo';
import SendBroadcastService from './services/SendBroadcastService';
import ListSizeService from './services/ListSizeService';

const StartPool = async (): Promise<void> => {
  let broadcastMessage: string;

  Bot.hears(
    /(\/?start|come(c|ç)ar?|iniciar?|\/?help|ajudar?|suporte)+/gim,
    async (context, next) => {
      const message = getMessageInfo(context);

      if (message.from.id === config.dev || message.from.id === config.boss) {
        // if (message.from.id === config.dev) {
        // if (message.from.id === config.boss) {
        await context.reply('Opa! O papai chegou!!');

        return next();
      }

      const createUser = container.resolve(CreateUserService);

      const { id, username, last_name, first_name } = message.from;

      const userCreated = await createUser.execute({
        name: first_name,
        telegramId: id,
        username,
        surname: last_name,
      });

      let photos = {
        photo1: `https://i.ibb.co/BzXLfBv/photo1.jpg`,
        photo2: `https://i.ibb.co/T04yFnN/photo2.jpg`,
        photo3: `https://i.ibb.co/NystLnz/photo3.jpg`,
        photo4: `https://i.ibb.co/XkyqBwL/photo4.jpg`,
        photo5: `https://i.ibb.co/QNRxbQ2/photo5.jpg`,
        photo6: `https://i.ibb.co/25VbZJP/photo6.jpg`,
      };

      if (process.env.NODE_ENV === 'development') {
        const testPhoto = () => {
          const rand = Math.floor(Math.random() * 10);
          if (rand > 5)
            return `https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Bet365_Logo.svg/1200px-Bet365_Logo.svg.png`;
          return `https://picsum.photos/400/300/?random=${rand}`;
        };

        photos = {
          photo1: testPhoto(),
          photo2: testPhoto(),
          photo3: testPhoto(),
          photo4: testPhoto(),
          photo5: testPhoto(),
          photo6: testPhoto(),
        };
      }

      await context.replyWithMediaGroup([
        {
          media: photos.photo2,
          type: 'photo',
        },
        {
          media: photos.photo3,
          type: 'photo',
        },
        {
          media: photos.photo4,
          type: 'photo',
        },
        {
          media: photos.photo5,
          type: 'photo',
        },
        {
          media: photos.photo6,
          type: 'photo',
        },
      ]);

      await context.replyWithPhoto(
        photos.photo1,
        Extra.caption(
          `🥳 <b>Bem vindo a <a href="https://t.me/InBETmentos">@inBETmentos</a></b> 🤑\n\n` +
            `<pre>SE LIGA SÓ NESSES RESULTADOS 🙄👆</pre>\n\n` +
            `<i>Você vai copiar e colar no canal pra ganhar igual, só isso...</i> 🤷‍♂🤷‍♀ \n\n` +
            `<b>Entre agora, vai expirar: </b>\n` +
            `https://t.me/joinchat/AAAAAEZ2ffrFZA6j33XkJA`,
        ).HTML(),
      );

      return next();
    },
  );

  Bot.on('message', async (context, next) => {
    const { from, text } = getMessageInfo(context);

    if (
      !(from.id === config.dev || from.id === config.boss) &&
      /(\/?start|come(c|ç)ar?|iniciar?|\/?help|ajudar?|suporte)+/gim.test(text)
    ) {
      return next();
    }

    if (
      !(from.id === config.dev || from.id === config.boss) &&
      !/(\/?start|come(c|ç)ar?|iniciar?|\/?help|ajudar?|suporte)+/gim.test(text)
    ) {
      await context.replyWithMarkdown(
        `Para que eu te mande um presente toque no botão abaixo =)\nNão vai se arrepender...`,
        Extra.markup(m =>
          m
            .keyboard([['Comecar']])
            .oneTime()
            .resize(),
        ),
      );

      return next();
    }

    if (!text) return next();

    const [, broadcastCommand] = text.split('/broadcast');
    if (!broadcastCommand) return next();

    broadcastMessage = text.replace('/broadcast', '').trim();

    await context.replyWithMarkdown(
      `Confira a mensagem antes de envia-la. Sua mensagem:\n\n` +
        `${broadcastMessage}`,
      Extra.markup(m =>
        m.inlineKeyboard([
          [m.callbackButton('✅ Enviar', 'confirmarEnvio')],
          [m.callbackButton('❌ Cancelar', 'cancelarEnvio')],
        ]),
      ),
    );

    return next();
  });

  Bot.action('confirmarEnvio', async context => {
    await context.answerCbQuery('Enviando...');

    const sendBroadcast = container.resolve(SendBroadcastService);
    await sendBroadcast.execute(broadcastMessage);

    await context.editMessageText('Broadcast enviado!');
  });

  Bot.action('cancelarEnvio', async context => {
    await context.answerCbQuery('Cancelando...');
    await context.editMessageText('Broadcast cancelado!');
  });

  Bot.command('lista', async context => {
    const listSize = container.resolve(ListSizeService);
    const size = await listSize.execute();

    await context.replyWithHTML(
      `Você possui <b>${size} cadastros</b> em sua lista`,
    );
  });

  const fulfilled = () => console.log(`Bot ${Bot.options.username} launched`);
  const rejected = reason => console.log('Not launched! Reason: ', reason);

  const errorCatcher = errStack => {
    console.log('Bot error handler >> ', errStack);

    Bot.telegram.sendMessage(
      config.dev,
      `Ocorreu um erro no bot.\n${errStack}`,
    );
  };

  Bot.launch().then(fulfilled, rejected);
  Bot.catch(errorCatcher);
};

StartPool();
