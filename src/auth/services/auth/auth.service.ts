import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async validateUser(details: UserDetails) {
		const { intraId } = details;
		const user = await this.userRepo.findOne({
			where: {
				intraId: intraId,
			}
		});
		if (user) return user;
		return this.createUser(details);
	}

	createUser(details: UserDetails) {
		console.log('Creating user');
		const user = this.userRepo.create(details);
		return this.userRepo.save(user);
	}

	findUser(intraId: string): Promise<User | undefined> {
		return this.userRepo.findOne({
			where: {
				intraId: intraId,
			},
		});
	}
}
