import ISendBroadcastDTO from '../dtos/ISendBroadcastDTO';

export default interface ITelegrafProvider {
  sendBroadcast(sendBroadcastDTO: ISendBroadcastDTO): Promise<boolean | number>;
}
