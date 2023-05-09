import { Module } from '@nestjs/common';
import { BomDiffService } from './service/bom-diff.service';
import { BomDiffAdapterModule } from '../../infrastructure/bom-diff-adapter/bom-diff-adapter.module';
import { BomParserService } from './service/bom-parser.service';
import { RepositoryCommitParserModule } from '../repository-commit-parser/repository-commit-parser.module';
import { ChangeManagementModule } from '../change-management/changeManagementModule';

@Module({
  imports: [
    BomDiffAdapterModule,
    RepositoryCommitParserModule,
    ChangeManagementModule,
  ],
  providers: [BomParserService, BomDiffService],
  exports: [BomDiffService],
})
export class BomDiffModule {}
