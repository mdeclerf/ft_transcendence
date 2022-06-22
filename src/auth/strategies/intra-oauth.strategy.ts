import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../services/auth/auth';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthenticationProvider) {
		super({
			clientID: process.env.INTRA_CLIENT_ID,
			clientSecret: process.env.INTRA_CLIENT_SECRET,
			callbackURL: process.env.INTRA_CALLBACK_URL,
			scope: 'public',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { id: intraId, username, displayName } = profile;
		const details = { intraId, username, displayName };
		console.log(profile);
		await this.authService.validateUser(details);
	}
}