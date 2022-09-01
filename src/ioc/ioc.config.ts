import { Lifetime } from "awilix";
import { Sequelize } from "sequelize";

import { DependencyType, DIKeys } from "./ioc.enums";
import { IDependency } from "./ioc.interfaces";

import { PostgresDatabaseRepository } from "../adapters/postgres.databaseAdapters";
import { MongoDBDatabaseRepository } from "../adapters/mongodb.databaseAdapters";

import { allModels } from "../database/models/all.models";
import { DatabaseSystem } from "../database/database.enums";

import { AuthenticationInteractor } from "../interactors/authentication.interactors";

import { PostgresDatabaseService } from "../database/postgres/postgres.databaseService";
import { MongoDBDatabaseService } from "../database/mongodb/mongodb.databaseService";

const getDatabaseRepositoryInstance = () => {
    switch (process.env.DATABASE_SYSTEM) {
        case DatabaseSystem.PostgreSQL:
            return PostgresDatabaseRepository;
        case DatabaseSystem.MongoDB:
            return MongoDBDatabaseRepository;
        default:
            return PostgresDatabaseRepository;
    }
}

/**
 * IoC definition
 */
export const IoCConfiguration: IDependency[] = [
    {
        name: DIKeys.sequelizeInstance,
        instance: Sequelize,
        lifetime: Lifetime.TRANSIENT,
        type: DependencyType.Resource,
    },
    {
        name: DIKeys.tableInstances,
        instance: allModels,
        lifetime: Lifetime.TRANSIENT,
        type: DependencyType.Resource,
    },
    {
        name: DIKeys.AuthenticationInteractor,
        instance: AuthenticationInteractor,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.DatabaseRepository,
        instance: getDatabaseRepositoryInstance(),
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.PostgresDatabaseService,
        instance: PostgresDatabaseService,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.MongoDBDatabaseService,
        instance: MongoDBDatabaseService,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
];
