#!/usr/bin/env node
import { CommandLineModule } from './application/command-line/command-line.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(CommandLineModule, ['log', 'warn', 'error']);
}
bootstrap();
