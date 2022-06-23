import { User } from "src/typeorm";

export type UserDetails = {
	username: string;
	intraId: string;
	displayName: string;
}

export type Done = (err: Error, user: User) => void;