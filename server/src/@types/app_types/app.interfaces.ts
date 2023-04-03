export enum redirectActions {
  LOGIN = 'login',
  DELETE = 'delete',
}
export interface MessagaEvent<T> {
  data: string | T;
}
export interface HookEntity {
  leadId: string | number;
  text: string;
  picture: string;
  users: string;
  subdomain: string;
  audio: string;
}
