import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { defaultDbOptions } from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(defaultDbOptions),
    AuthModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
