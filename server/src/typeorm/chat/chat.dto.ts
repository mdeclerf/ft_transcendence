import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class CreateChatDto{
	@IsInt()
	@IsPositive()
	public room_number: number;

	@IsString()
	@IsNotEmpty()
	public body: string;
}