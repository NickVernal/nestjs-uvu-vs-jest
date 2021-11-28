import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

import { defaultDbOptions } from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultDbOptions),
    AuthModule,
    CategoriesModule,
  ],
})
export class AppModule {}
