import { User } from "src/typeorm";
import { UserDetails } from "../../utils/types";

export interface AuthenticationProvider {
	validateUser(details: UserDetails);
	createUser(details: UserDetails);
	findUser(intraId: string): Promise<User | undefined>;
}