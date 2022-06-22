import { Injectable } from '@nestjs/common';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
	validateUser() {
		throw new Error('Method not implemented.');
	}
	createUser() {
		throw new Error('Method not implemented.');
	}
	findUser() {
		throw new Error('Method not implemented.');
	}

}
