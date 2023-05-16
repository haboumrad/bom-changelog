import { NestFactory } from '@nestjs/core';
import { CommandLineModule } from './application/command-line/command-line.module';
import { CommandLineService } from './application/command-line/command-line.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandLineModule);
  const commandLineService = app
    .select(CommandLineModule)
    .get(CommandLineService, { strict: true });
  await commandLineService.run();

  await app.close();
}
bootstrap();
