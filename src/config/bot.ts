import Telegraf from 'telegraf';

const token =
  process.env.NODE_ENV === 'development'
    ? '1392522549:AAERso-vw5-pUREgmcUtBW3lQmj_D2-2h3s'
    : '1198716803:AAGifrMgwsobKUf0vhuFlJJTH_1TiTdHmaM';

export const config = {
  token,
  link: 'http://t.me/InBETmentosbot',
  boss: 1127085150,
  dev: 879965454,
  options: {},
};

export const Bot = new Telegraf(config.token, config.options);
