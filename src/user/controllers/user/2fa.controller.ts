import { Body, Controller, HttpCode, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthenticatedGuard } from "src/auth/guards/intra-oauth.guard";
import { AuthService } from "src/auth/services/auth.service";
import { TwoFactorAuthenticationService } from "src/user/services/user/2fa.service";
import { UserService } from "src/user/services/user/user.service";
import { TwoFactorAuthCodeDto } from "src/utils/twoFactorAuthCode.dto";
import { RequestWithUser } from "src/utils/types";

@Controller('2fa')
// @UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		@Inject('2FA_SERVICE') private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		@Inject('USER_SERVICE') private readonly userService: UserService,
		@Inject('AUTH_SERVICE') private readonly authService: AuthService
	) {}

	@Post('generate')
	@UseGuards(AuthenticatedGuard)
	async register(@Res() res: Response, @Req() req: RequestWithUser) {
		const { otpauthURL } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthURL);
	}

	@Post('turn_on')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async turnOnTwoFactorAuthentication(@Req() req: RequestWithUser, @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto) {
		const isValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(twoFactorAuthCode, req.user);

		// console.log(twoFactorAuthCode);

		if (!isValid) throw new UnauthorizedException('Wrong authentication code');

		await this.userService.enableTwoFactorAuthentication(req.user.id);
		return 'ok';
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(AuthenticatedGuard)
	async authenticate(
		@Req() req: RequestWithUser,
		@Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
	) {
		console.log(twoFactorAuthCode);
		// console.log(req.user);
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthCodeValid(
			twoFactorAuthCode, req.user
		);
		console.log('code', isCodeValid);
		if (!isCodeValid) throw new UnauthorizedException('Wrong authentication code');

		this.authService.validateUser(req.user);

		this.userService.secondFactorAuthenticate(req.user.id, true);

		return req.user;
	}
}