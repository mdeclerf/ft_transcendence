import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../typeorm.module";

@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	public message_id!: number;
	
	@Column ({type: 'integer'})
	public room_number: number;

	@Column({type: 'text'})
	public body: string;

	@ManyToOne(() => User, (user) => user.chat)
	public user: User

	@CreateDateColumn({name: 'createdat', type: 'timestamp'})
	public createdAt!: Date;
}
