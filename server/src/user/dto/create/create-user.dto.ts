export class CreateUserDto {
  widgetUserSubdomain: string;
  accountId: number;
  paid: boolean;
  installed: boolean;
  testPeriod: boolean;
  startUsingDate: string;
  finishUsingDate: string;
}
