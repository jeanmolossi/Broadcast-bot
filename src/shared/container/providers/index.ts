import { container } from 'tsyringe';

import ITelegrafProvider from './telegrafProvider/models/ITelegrafProvider';
import TelegrafProvider from './telegrafProvider/implementations/TelegrafProvider';

container.registerSingleton<ITelegrafProvider>(
  'TelegrafProvider',
  TelegrafProvider,
);
