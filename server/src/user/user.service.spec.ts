import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
  });
});
