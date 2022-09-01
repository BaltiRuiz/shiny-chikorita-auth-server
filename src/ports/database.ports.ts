import { IUser } from "../database/database.interfaces";

export interface IDatabaseRepository {
    createUser(userName: string, userPassword: string): Promise<IUser>;
    getUserByName(userName: string): Promise<IUser>;
}
