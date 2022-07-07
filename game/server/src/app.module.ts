import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
	host: 'localhost',
	username: 'user',
	password: '123',
	database: 'game',
	entities: [Game],
	synchronize: true,
  }),
  TypeOrmModule.forFeature([Game]),],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})

export class AppModule {}
