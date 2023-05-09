import { Module } from '@nestjs/common';
import { RepositoryCommitParserModule } from '../repository-commit-parser/repository-commit-parser.module';
import { ChangeManagementModule } from '../change-management/changeManagementModule';
import { BomDiffModule } from '../bom-diff/bom-diff.module';
import { BomChangelogGeneratorService } from './service/bom-changelog-generator.service';

@Module({
  imports: [
    BomDiffModule,
    RepositoryCommitParserModule,
    ChangeManagementModule,
  ],
  providers: [BomChangelogGeneratorService],
  exports: [BomChangelogGeneratorService],
})
export class BomChangelogGeneratorModule {}
