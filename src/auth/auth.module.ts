import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { IntraStrategy } from './strategies/intra-oauth.strategy';

@Module({
  controllers: [AuthController],
  providers: [IntraStrategy, {
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  }]
})
export class AuthModule {}
