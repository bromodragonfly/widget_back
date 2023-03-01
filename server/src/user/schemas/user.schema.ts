import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
// TODO необходимо декомпозировать логику добавления нового пользователя и логику работы виджета при тестовом периоде или оплаты
@Schema()
export class User {
  @Prop({ required: true })
  widgetUserSubdomain: string;

  @Prop()
  accountId: number;

  @Prop()
  paid: boolean;

  @Prop()
  installed: boolean;

  @Prop()
  testPeriod: boolean;

  @Prop()
  startUsingDate: string;

  @Prop()
  finishUsingDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
