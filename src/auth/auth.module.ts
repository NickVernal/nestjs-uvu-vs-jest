import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategies/api-key/api-key.strategy';

@Module({
  imports: [PassportModule],
  providers: [ApiKeyStrategy],
  exports: [ApiKeyStrategy],
})
export class AuthModule {}
