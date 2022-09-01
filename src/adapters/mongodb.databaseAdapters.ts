import { IDatabaseRepository } from "../ports/database.ports";

import { DatabaseModelName } from "../database/database.enums";

import { IUser } from "../database/database.interfaces";

import { MongoDBDatabaseService } from "../database/mongodb/mongodb.databaseService";

export class MongoDBDatabaseRepository implements IDatabaseRepository {
    /**
     * Creates an instance of MongoDBDatabaseRepository
     *
     * @param {MongoDBDatabaseService} MongoDBDatabaseService 
     */
    constructor(
        private MongoDBDatabaseService: MongoDBDatabaseService
    ) {}

    /**
     * Returns the current number of users registered into the application
     * 
     * @memberof MongoDBDatabaseRepository
     */
    private async getNumberOfUsers(): Promise<number> {
        return await this.MongoDBDatabaseService.usingTable<IUser>(DatabaseModelName.User).countDocuments();
    }

    /**
     * Adds a new user to the database
     *
     * @param {string} userName
     * @param {string} userPassword
     * 
     * @memberof MongoDBDatabaseRepository
     */
    public async createUser(userName: string, userPassword: string): Promise<IUser> {
        try {
            const numUsers = await this.getNumberOfUsers();

            const newUserID = numUsers + 1;

            const insertResult = await this.MongoDBDatabaseService.usingTable<Partial<IUser>>(DatabaseModelName.User).insertOne(
                { id: newUserID, name: userName, password: userPassword },
            );

            if (insertResult.acknowledged) {
                return { id: newUserID, name: userName, password: userPassword };
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(`There was an error while registering user ${userName}: ${error}`);
        }
    }

    /**
     * Retrieves a user from database given its name
     *
     * @param {string} userName
     * 
     * @memberof MongoDBDatabaseRepository
     */
    public async getUserByName(userName: string): Promise<IUser> {
        const user = await this.MongoDBDatabaseService.usingTable<IUser>(DatabaseModelName.User).findOne(
            { name: userName },
        );

        return user ? user : null;
    }
}