import { Module } from '@nestjs/common';
import { RepositoryCommitParserService } from './service/repository-commit-parser.service';
import { RepositoryCommitParserAdapterModule } from '../../infrastructure/repository-commit-parser-adapter/repository-commit-parser-adapter.module';

@Module({
  imports: [RepositoryCommitParserAdapterModule],
  providers: [RepositoryCommitParserService],
  exports: [RepositoryCommitParserService],
})
export class RepositoryCommitParserModule {}
