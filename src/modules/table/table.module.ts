import { Global, Module } from '@nestjs/common';
import { TableService } from './table.service';

@Global()
@Module({
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
