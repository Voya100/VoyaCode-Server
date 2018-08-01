import { PushController } from '@api/push/push.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PushController]
})
export class PushModule {}
