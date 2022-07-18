import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/services/user/user.service';
import { RequestWithUser } from 'src/utils/types';
import { AuthenticatedGuard, IntraAuthGuard } from '../guards/intra-oauth.guard';

@Controller('auth')
export class AuthController {
	
	constructor(@Inject('USER_SERVICE') private readonly userService: UserService) {}
	
	@Get('login')
	@UseGuards(IntraAuthGuard)
	login() {}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Req() req: RequestWithUser, @Res() res: Response) {
		if (!req.user.isTwoFactorAuthenticationEnabled) {
			res.redirect('http://localhost:3000/game');
		} else {
			res.redirect('http://localhost:3000/');
		}
	}

	@Get('status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req: RequestWithUser) {
		return req.user;
	}

	@Get('logout')
	@UseGuards(AuthenticatedGuard)
	logout(@Req() req: RequestWithUser) {
		this.userService.secondFactorAuthenticate(req.user.id, false);
		req.logOut((err) => {
			if (err) throw err;
		});
	}
}
