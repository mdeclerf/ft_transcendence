import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { nextTick } from 'process';
import { AuthenticatedGuard, IntraAuthGuard } from 'src/auth/guards/intra-oauth.guard';

@Controller('auth')
export class AuthController {
	
	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {
		return;
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect() {
		return 'ok';
	}

	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req: Request) {
		return req.user;
	}

	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	logout(@Req() req: Request) {
		req.logout((err) => {
			if (err) { return err; }
		});
	}
}
