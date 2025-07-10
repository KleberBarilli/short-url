import 'dotenv/config';
import * as Sentry from '@sentry/nestjs';
import { SENTRY_DSN, SENTRY_STATUS } from './app/common/constants';
import { Logger } from '@nestjs/common';

export const IS_SENTRY_ENABLED = SENTRY_STATUS === 'on' && !!SENTRY_DSN;

if (IS_SENTRY_ENABLED) {
  Logger.warn('Sentry is enabled. Initializing...');
  Sentry.init({
    dsn: SENTRY_DSN,
    sendDefaultPii: true,
  });
}
