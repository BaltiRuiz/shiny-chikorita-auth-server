import { DatabaseModelName } from "../database/database.enums";

import { IUser } from "../database/database.interfaces";

import { PostgresDatabaseService } from "../database/postgres/postgres.databaseService";

import { IDatabaseRepository } from "../ports/database.ports";

export class PostgresDatabaseRepository implements IDatabaseRepository {
    /**
     * Creates an instance of PostgresDatabaseRepository
     *
     * @param {PostgresDatabaseService} PostgresDatabaseService
     * 
     * @memberof PostgresDatabaseRepository
     */
    constructor(
        private PostgresDatabaseService: PostgresDatabaseService
    ) {}

    /**
     * Adds a new user to the database
     *
     * @param {string} userName
     * @param {string} userPassword
     * 
     * @memberof PostgresDatabaseRepository
     */
    public async createUser(userName: string, userPassword: string): Promise<IUser> {
        try {
            const newUser = await this.PostgresDatabaseService.usingTable(DatabaseModelName.User).create(
                { name: userName, password: userPassword },
            );

            return newUser.get({ plain: true });
        } catch (error) {
            throw new Error(`There was an error while registering user ${userName}: ${error}`);
        }
    }

    /**
     * Retrieves a user from database given its name
     *
     * @param {string} userName
     * 
     * @memberof PostgresDatabaseRepository
     */
    public async getUserByName(userName: string): Promise<IUser> {
        const user = await this.PostgresDatabaseService.usingTable(DatabaseModelName.User).findOne(
            { where: { name: userName } },
        );

        if (user) {
            return user.get({ plain: true });
        } else {
            return null;
        }
    }
}
