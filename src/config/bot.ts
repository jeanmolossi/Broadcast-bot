import Telegraf from 'telegraf';

export const config = {
  token: '1060859414:AAFYuAd3OJ5Doh_ApVx74XvPKwvCEMW3xfc',
  link: 'http://t.me/inbetmentosfreebot',
  boss: 1127085150,
  dev: 879965454,
  options: {},
};

export const Bot = new Telegraf(config.token, config.options);
