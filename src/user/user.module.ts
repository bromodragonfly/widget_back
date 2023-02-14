import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/gong'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
