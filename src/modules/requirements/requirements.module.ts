import { Global, Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';

@Global()
@Module({
  providers: [RequirementsService],
  exports: [RequirementsService],
})
export class RequirementsModule {}
