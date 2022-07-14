import { ClassSerializerInterceptor, Controller, Get, Inject, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { AuthenticatedGuard } from "src/auth/guards/intra-oauth.guard";
import { TwoFactorAuthenticationService } from "src/user/services/user/2fa.service";
import { RequestWithUser } from "src/utils/types";

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(@Inject('2FA_SERVICE') private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService) {}

	@Post('generate')
	@UseGuards(AuthenticatedGuard)
	async register(@Res() res: Response, @Req() req: RequestWithUser) {
		const { otpauthURL } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthURL);
	}
}