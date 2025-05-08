import { Global, Module } from '@nestjs/common';
import { RunService } from './run.service';

@Global()
@Module({
  providers: [RunService],
  exports: [RunService],
})
export class RunModule {}
