import axios from 'axios';
import { Logger } from '@nestjs/common';
import { amoError } from '../@types/amo_types/amo.interfaces';
import * as fs from 'fs';
// import { RefreshAccessTokenDto } from './dto/get-access-token.dto';

export class AmoApi {
  private readonly logger = new Logger();

  AMO_TOKEN_PATH: string;
  LIMIT: number;
  ROOT_PATH: string;
  access_token: string;
  refresh_token: string;
  subdomain: string;
  code: string;

  constructor(subdomain: string, code: string) {
    this.AMO_TOKEN_PATH = `amo_token${subdomain}.json`;
    this.LIMIT = 200;
    this.ROOT_PATH = `https://${subdomain}.amocrm.ru`;
    this.access_token = '';
    this.refresh_token = '';
    this.code = code;
  }

  private readonly authChecker = <T extends any[], D>(
    request: (...args: T) => Promise<D>,
  ) => {
    return async (...args: T): Promise<D> => {
      if (!this.access_token) {
        return this.getAccessToken().then(() =>
          this.authChecker(request)(...args),
        );
      }
      return request(...args).catch(async (err: amoError) => {
        this.logger.error(err.response);
        this.logger.error(err);
        this.logger.error(err.response.data);
        const data = err.response.data;
        if ('validation-errors' in data) {
          //   data['validation-errors'].forEach((element) =>
          //     this.logger.debug(element.errors),
          //   );
          this.logger.error('args', JSON.stringify(args, null, 2));
        }
        if (data.status == 401 && data.title === 'Unauthorized') {
          this.logger.debug('necessary to refresh token');
          return this.refreshToken().then(() =>
            this.authChecker(request)(...args),
          );
        }
        throw err;
      });
    };
  };

  async requestAccessToken() {
    return axios
      .post(`${this.ROOT_PATH}/oauth2/access_token`, {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        code: this.code,
        redirect_uri: process.env.REDIRECT_URI,
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  async getAccessToken() {
    if (this.access_token) {
      return Promise.resolve(this.access_token);
    }
    try {
      const content = fs.readFileSync(this.AMO_TOKEN_PATH).toString();
      const token = JSON.parse(content);
      this.access_token = token.access_token;
      this.refresh_token = token.refresh_token;
      return Promise.resolve(token);
    } catch (error) {
      this.logger.error(
        `Error while reading file ${this.AMO_TOKEN_PATH}`,
        error,
      );
      this.logger.debug('Trying to get a new token');
      const token = await this.requestAccessToken();
      fs.appendFileSync(this.AMO_TOKEN_PATH, JSON.stringify(token));

      this.access_token = token.access_token;
      this.refresh_token = token.refresh_token;
      return Promise.resolve(token);
    }
  }

  async refreshToken() {
    return axios
      .post(`${this.ROOT_PATH}/oauth2/access_token`, {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: this.refresh_token,
        redirect_uri: process.env.REDIRECT_URI,
      })
      .then((res) => {
        this.logger.debug('Token updated successfully');
        const token = res.data;
        fs.writeFileSync(this.AMO_TOKEN_PATH, JSON.stringify(token));
        this.access_token = token.access_token;
        this.refresh_token = token.refresh_token;
        return token;
      })
      .catch((err) => {
        this.logger.error('Failed to refresh token', err.response.data);
      });
  }

  getAccountData = this.authChecker(async () => {
    const res = await axios.get(`${this.ROOT_PATH}/api/v4/account`, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return res.data;
  });
}
