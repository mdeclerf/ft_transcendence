import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/utils/types';

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const activate = (await super.canActivate(context)) as boolean;
		const request: RequestWithUser = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: RequestWithUser = context.switchToHttp().getRequest();
		return req.isAuthenticated();
	}
}

