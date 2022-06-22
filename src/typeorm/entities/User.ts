import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'intra_id' })
	intraId: string;

	@Column({ name: 'display_name' })
	displayName: string;
}