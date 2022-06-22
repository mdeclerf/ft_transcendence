import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { IntraAuthGuard } from 'src/auth/guards/intra-oauth.guard';

@Controller('auth')
export class AuthController {
	
	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {
		return;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		return res.send(200);
	}

	@Get('status')
	status() {}

	@Get('logout')
	logout() {}
}
