import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3001;
  app.setGlobalPrefix('api');
  app.use(
    session({
      cookie: {
        maxAge: 360000 * 24,
      },
      secret: 'aousdhgaoisdhgqoiwehtoqiwer',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT, () => { console.log(`Running on port ${PORT}`) });
}
bootstrap();
