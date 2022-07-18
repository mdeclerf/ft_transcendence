import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'intra_id' , unique: true })
	intraId: string;

	@Column()
	username: string;

	@Column({ name: 'display_name' })
	displayName: string;

	@Column({ name: 'photo_url', nullable: true})
	photoURL: string;

	@Column({ nullable: true})
	twoFactorAuthenticationSecret: string;

	@Column({ default: false })
	isTwoFactorAuthenticationEnabled: boolean;
	
	@Column({ default: false })
	isSecondFactorAuthenticated: boolean;
}