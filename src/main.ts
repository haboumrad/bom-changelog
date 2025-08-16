#!/usr/bin/env node
import { CommandLineModule } from './application/command-line/command-line.module';
import { CommandFactory } from 'nest-commander';
import axios, { AxiosError } from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError) {
      console.error(
        `Error. Method: ${error.config.method}, URL: ${
          error.config.url
        }, Status: ${error.response?.status}, Message: ${
          error.message
        }, Request Data: ${
          error.config.data ? JSON.stringify(error.config?.data) : undefined
        }, Response Data: ${
          error.response?.data
            ? JSON.stringify(error.response?.data)
            : undefined
        }`,
      );
    }
  },
);

async function bootstrap() {
  await CommandFactory.run(CommandLineModule, ['log', 'warn', 'error']);
}
bootstrap();
