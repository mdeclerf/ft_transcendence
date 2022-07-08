import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';

async function bootstrap() {
	const app = await NestFactory.create(GameModule);
	app.enableCors({
		origin: "http://localhost:3000",
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	});
	await app.listen(3001);
}
bootstrap();
