import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'intra_id' , unique: true })
	intraId: string;

	// @Column()
	// username: string;

	@Column({ name: 'display_name' })
	displayName: string;
}