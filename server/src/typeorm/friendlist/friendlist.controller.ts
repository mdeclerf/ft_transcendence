import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateFriendlistDto } from './friendlist.dto';
import { Friendlist } from './friendlist.entity';
import { FriendlistService } from './friendlist.service';

@Controller('friendlist')
export class FriendlistController {

	@Inject(FriendlistService)
	private readonly service: FriendlistService ;

	@Get('user/:id')
	public getFriendlist(@Param('id', ParseIntPipe) id: number): Promise<Friendlist[]> {
		return this.service.getFriendlist(id);
	}

	@Get('friend/:id')
	public getFriendOf(@Param('id', ParseIntPipe) id: number): Promise<Friendlist[]> {
		return this.service.getFriendOf(id);
	}

	@Post()
	public createFriendlink(@Body() body: CreateFriendlistDto): Promise<Friendlist> {
		return this.service.createFriendlink(body);
	}
}