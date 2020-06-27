import Telegraf from 'telegraf';

export const config = {
  token: '1198716803:AAGifrMgwsobKUf0vhuFlJJTH_1TiTdHmaM',
  link: 'http://t.me/InBETmentosbot',
  boss: 1127085150,
  dev: 879965454,
  options: {},
};

export const Bot = new Telegraf(config.token, config.options);
