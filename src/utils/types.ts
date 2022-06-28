import { User } from "../typeorm";

export type UserDetails = {
	username: string;
	intraId: string;
	displayName: string;
	photoURL: string;
}

export type Done = (err: Error, user: User) => void;