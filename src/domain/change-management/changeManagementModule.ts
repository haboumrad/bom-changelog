import { Module } from '@nestjs/common';
import { ChangeLogService } from './service/changelog.service';
import { ChangeManagementAdapterModule } from '../../infrastructure/change-management-adapter/change-management-adapter.module';

@Module({
  imports: [ChangeManagementAdapterModule],
  providers: [ChangeLogService],
  exports: [ChangeLogService],
})
export class ChangeManagementModule {}
