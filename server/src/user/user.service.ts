import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, updateUser } from './dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createNewUser(CreateUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(CreateUserDto);
    return await createdUser.save();
  }

  async findUserBySubdomain(subdomain: string): Promise<User> {
    return this.userModel.findOne({ widgetUserSubdomain: subdomain }).exec();
  }

  async findUserByAccountID(id: number): Promise<User> {
    return this.userModel.findOne({ accountId: id }).exec();
  }

  async updateUser(dto: updateUser) {
    if ('installed' in dto) {
      if (dto.installed) {
        await this.userModel.updateOne(
          { widgetUserSubdomain: dto.subdomain },
          { $set: { installed: dto.installed } },
        );
        return this.logger.debug(`User ${dto.subdomain} installed succesfuly`);
      }
      await this.userModel.updateOne(
        { widgetUserSubdomain: dto.subdomain },
        { $set: { installed: dto.installed } },
      );
      return this.logger.debug(`User ${dto.subdomain} unistalled succesfuly`);
    }
    this.userModel.updateOne(
      { widgetUserSubdomain: dto.subdomain },
      { $set: { testPeriod: dto.testPeriod, paid: dto.paid } },
    );
    return this.logger.debug(`User ${dto.subdomain} updated succesfuly`);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
