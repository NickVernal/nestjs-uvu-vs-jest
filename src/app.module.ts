import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { defaultDbOptions } from './typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(defaultDbOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
