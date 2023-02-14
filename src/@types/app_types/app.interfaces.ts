export enum redirectActions {
  LOGIN = 'login',
  DELETE = 'delete',
}
export interface MessagaEvent {
  data: string | object;
}
export interface HookEntity {
  leadId: string | number;
  text: string;
  picture: string;
  subdomain: string;
  audio: string;
  userPicture?: string;
}
