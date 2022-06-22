import { UserDetails } from "../../../utils/types";

export interface AuthenticationProvider {
	validateUser(details: UserDetails);
	createUser();
	findUser();
}