import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthStrategy, apiKeyHeader } from '../../../constants';
import { env } from '../../../config';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  AuthStrategy.ApiKey,
) {
  constructor() {
    super({ header: apiKeyHeader, prefix: '' }, true, verify);
  }
}

function verify(apiKey: string, done: (error: Error, data) => void) {
  if (env.API_KEY === apiKey) {
    done(null, true);
  }
  done(new UnauthorizedException(), null);
}
