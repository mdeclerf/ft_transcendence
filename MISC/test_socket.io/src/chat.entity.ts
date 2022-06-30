import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
  } from 'typeorm';

  // https://typeorm.io/entities
  @Entity()
  export class Chat {
	@PrimaryGeneratedColumn('uuid')
	id: number;
  
	@Column()
	email: string;
  
	@Column({ unique: true })
	text: string;
  
	@CreateDateColumn()
	createdAt: Date;
}
