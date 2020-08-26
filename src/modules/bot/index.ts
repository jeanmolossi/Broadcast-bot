import 'reflect-metadata';
import fs from 'fs';
import { container } from 'tsyringe';
import Extra from 'telegraf/extra';

import { Bot, config } from '@config/bot';
import CreateUserService from '@modules/users/services/CreateUserService';

import getMessageInfo from './utils/getMessageInfo';
import SendBroadcastService from './services/SendBroadcastService';
import ListSizeService from './services/ListSizeService';
import SendMediaService from './services/SendMediaService';

const StartPool = async (): Promise<void> => {
  let broadcastMessage: string;

  Bot.hears(
    /(\/?start|come(c|ç)ar?|iniciar?|\/?help|ajudar?|suporte)+/gim,
    async (context, next) => {
      const message = getMessageInfo(context);

      // if (message.from.id === config.dev || message.from.id === config.boss) {
      // if (message.from.id === config.dev) {
      if (message.from.id === config.boss) {
        await context.reply('Opa! O papai chegou!!');

        return next();
      }

      const createUser = container.resolve(CreateUserService);

      const { id, username, last_name, first_name } = message.from;

      await createUser.execute({
        name: first_name,
        telegramId: id,
        username,
        surname: last_name,
      });

      let photos = {
        photo1: `https://i.ibb.co/sVjzsnM/photo1.jpg`,
        photo2: `https://i.ibb.co/gW5X4tP/photo2.jpg`,
        photo3: `https://i.ibb.co/1JqhDNV/photo3.jpg`,
        photo4: `https://i.ibb.co/V3znvbK/photo4.jpg`,
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
        };
      }

      await context.replyWithMediaGroup([
        {
          media: photos.photo1,
          type: 'photo',
        },
        {
          media: photos.photo2,
          type: 'photo',
        },
      ]);

      await context.replyWithMediaGroup([
        {
          media: photos.photo3,
          type: 'photo',
        },
        {
          media: photos.photo4,
          type: 'photo',
        },
      ]);

      await context.replyWithVideo(
        {
          url: `https://i.imgur.com/wk8NBlu.mp4`,
          filename: 'video1.mp4',
        },
        Extra.caption(
          `👆 <b>Aposta no Ponto AO VIVO </b> 😳\n\n` +
            `<i>Quanto você  ganha por dia? 100 reais? E por hora? Uns 15 ou 10? Veja o potencial desse mercado no vídeo acima</i> 👆` +
            `<pre>Em 30 segundos ganhei 1/4 do salário mínimo.</pre>\n\n` +
            `<u>Quando você sabe o quê  faz, você coloca dinheiro nisso!!!!!</u> 👌 \n\n` +
            `🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾\n\n` +
            `<b>Lucrar 1k-3k ajudaria você, nas contas, familia e sonhos?</b>\n` +
            `👨‍👩‍👧‍👦🛫🏖🚘🏍💰🏡🧾\n\n` +
            `com a Aposta no Ponto🎾 em tênis minha realidade mudou.\n\n` +
            `E o melhor... 👇\n\n` +
            `🤭 <b>SEM</b> envio de ❌tips, sem precisar de ❌vip e esqueça ❌tipsters pra sempre\n\n` +
            `<a href="https://t.me/joinchat/AAAAAEZ2ffrFZA6j33XkJA">https://t.me/joinchat/AAAAAEZ2ffrFZA6j33XkJA</a>\n\n` +
            `🚪ENTRE 👆 no canal para saber como também fazer esse resultado diário... <u>A SUA TAMBÉM PODE, SÓ DEPENDE DE VOCÊ QUERER ISSO!!!</u> 💪 \n\n` +
            `<i>...CAI PRA DENTRO, mesmo que sua banca inicial seja só 100</i> 💶\n\n` +
            `Sua libertação dos Vips, tips e tipsters está aqui 👇👇👇\n` +
            `<a href="https://t.me/joinchat/AAAAAEZ2ffrFZA6j33XkJA">https://t.me/joinchat/AAAAAEZ2ffrFZA6j33XkJA</a>\n\n`,
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

  Bot.command('media', async (context, next) => {
    if (!('reply_to_message' in context.message)) {
      await context.reply(
        'Para enviar a mídia selecione responder na mensagem com a mídia',
      );
      return next();
    }
    if (!context.message) return next();

    const {
      photo,
      video_note,
      video,
      voice,
      audio,
    } = context.message.reply_to_message;

    if (!!photo && !!video_note && !!video && !!voice && !!audio) return next();

    const sendMedia = container.resolve(SendMediaService);
    await sendMedia.execute(context.message);

    return next();
  });

  // eslint-disable-next-line no-console
  const fulfilled = () => console.log(`Bot ${Bot.options.username} launched`);
  // eslint-disable-next-line no-console
  const rejected = reason => console.log('Not launched! Reason: ', reason);

  const errorCatcher = errStack => {
    // eslint-disable-next-line no-console
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
