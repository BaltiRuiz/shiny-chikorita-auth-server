import { Collection, MongoClient } from "mongodb";

import { DatabaseSystem } from "../database.enums";

export class MongoDBDatabaseService {
    private mongoClient: MongoClient;

    /**
     * Gets an individual table to be used
     *
     * @param {string} tableName
     * 
     * @memberof MongoDBDatabaseService
     */
    public usingTable<T>(tableName: string): Collection<T> {
        return this.mongoClient.db().collection<T>(tableName);
    }

    /**
     * Creates a connection to the mongo database
     * 
     * @private
     * 
     * @memberof MongoDBDatabaseService
     */
    private async createConnection() {
        this.mongoClient = new MongoClient(
            `mongodb://localhost:27017/${process.env.MONGODB_DATABASE_NAME}`
        );

        await this.mongoClient.connect();

        console.log("Successfully connected to MongoDB database");
    }

    /**
     * Starts up the service
     * 
     * @private
     * 
     * @memberof MongoDBDatabaseService
     */
    private init() {
        try {
            if (process.env.DATABASE_SYSTEM === DatabaseSystem.MongoDB) {
                this.createConnection();
            }
        } catch (error) {
            throw new Error(`There was an error while starting the MongoDB database service: ${error}`);
        }
    }

    /**
     * Creates an instance of MongoDBDatabaseService
     * 
     * @memberof MongoDBDatabaseService
     */
    constructor() {
        this.init();
    }
}