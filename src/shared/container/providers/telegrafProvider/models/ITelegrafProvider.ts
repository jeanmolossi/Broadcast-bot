import ISendBroadcastDTO from '../dtos/ISendBroadcastDTO';
import ISendBroadcastMediaDTO from '../dtos/ISendBroadcastMediaDTO';

export default interface ITelegrafProvider {
  sendBroadcast(sendBroadcastDTO: ISendBroadcastDTO): Promise<boolean | number>;
  sendBroadcastMedia(
    sendBroadcastMediaDTO: ISendBroadcastMediaDTO,
  ): Promise<boolean | number>;
}
