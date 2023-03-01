export class GetAccessTokenDto {
  readonly client_id: string;
  readonly client_secret: string;
  readonly grant_type: string; //'authorization_code'
  readonly code: string;
  readonly redirect_uri: string;
}

export class RefreshAccessTokenDto {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token: string;
  redirect_uri: string;
}
