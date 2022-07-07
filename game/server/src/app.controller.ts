import { Controller, Inject, Get} from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from './game.entity';

@Controller('game')
export class AppController {
@Inject(AppService)
	private readonly service: AppService;

	@Get("")
	public getChat() : Promise<Game[]> {
		return this.service.getGame();
	}
}
