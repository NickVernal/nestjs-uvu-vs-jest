import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../../../constants';

@Injectable()
export class ApiKeyGuard extends AuthGuard(AuthStrategy.ApiKey) {}
