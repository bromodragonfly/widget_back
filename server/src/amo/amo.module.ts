import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';

@Module({
  imports: [HttpModule],
  providers: [AmoService],
  exports: [AmoService],
})
export class AmoModule {}
