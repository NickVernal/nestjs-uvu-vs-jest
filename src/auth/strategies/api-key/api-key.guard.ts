import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from 'src/constants';

@Injectable()
export class ApiKeyGuard extends AuthGuard(AuthStrategy.ApiKey) {}
