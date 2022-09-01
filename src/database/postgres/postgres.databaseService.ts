import { Sequelize, ModelAttributes } from "sequelize";

import { Table } from "../models/common.model";

import { SequelizeModel } from "../database.interfaces";
import { DatabaseSystem } from "../database.enums";

/**
 * Manages the connection to the database
 * 
 * @class PostgresDatabaseService
 */
export class PostgresDatabaseService {
    private sequelizeConnection: Sequelize;
    private tableInstances: Array<Table> = [];
    private tables: Map<string, SequelizeModel> = new Map<string, SequelizeModel>([]);

    /**
     * Gets an individual table to be used
     *
     * @param {string} tableName
     * 
     * @memberof PostgresDatabaseService
     */
    public usingTable(tableName: string): SequelizeModel {
        return this.tables.get(tableName);
    }

    /**
     * Creates a connection to the sequelize instance
     * 
     * @private
     * 
     * @memberof PostgresDatabaseService
     */
    private createConnection() {
        this.sequelizeConnection = new Sequelize(
            process.env.POSTGRES_DATABASE_NAME,
            process.env.POSTGRES_DATABASE_USERNAME,
            process.env.POSTGRES_DATABASE_PASSWORD,
            {
                dialect: "postgres",
                host: process.env.POSTGRES_DATABASE_HOST,
                port: +process.env.POSTGRES_DATABASE_PORT,
            },
        );

        this.sequelizeConnection.authenticate()
            .then(() => {
                console.log("Successfully connected to PostgreSQL database instance");
            })
            .catch((error) => {
                throw new Error(`There was an error while connecting to database instance: ${error}`);
            });
    }

    /**
     * Initialises the tables in the sequelize instance
     * 
     * @private
     * 
     * @memberof PostgresDatabaseService
     */
    private initialiseTableInstances() {
        this.tableInstances.forEach((table: Table) => {
            console.log(`Initialising database table: ${table.tableName}`);

            const createdModel = (this.sequelizeConnection.define(
                table.className,
                table.columnDefinitions as ModelAttributes,
                {
                    tableName: table.tableName,
                    timestamps: false,
                },
            ) as unknown) as SequelizeModel;

            this.tables.set(table.className, createdModel);
        });
    }

    /**
     * Starts up the service
     * 
     * @private
     * 
     * @memberof PostgresDatabaseService
     */
    private init() {
        try {
            if (process.env.DATABASE_SYSTEM === DatabaseSystem.PostgreSQL) {
                this.createConnection();
                this.initialiseTableInstances();
            }
        } catch (error) {
            throw new Error(`There was an error while starting the PostgreSQL database service: ${error}`);
        }
    }

    /**
     * Creates an instance of PostgresDatabaseService
     * 
     * @param {*} sequelizeInstance
     * @param {Array<Table>} tableInstances
     * 
     * @memberof PostgresDatabaseService
     */
    constructor(sequelizeInstance: any, tableInstances: Array<Table>) {
        this.sequelizeConnection = sequelizeInstance;
        this.tableInstances = tableInstances;

        this.init();
    }
}
