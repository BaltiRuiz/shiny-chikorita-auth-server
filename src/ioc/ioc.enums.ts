export enum DependencyType {
    ClassOrService,
    Resource,
}

export enum DIKeys {
    sequelizeInstance = "sequelizeInstance",
    tableInstances = "tableInstances",

    AuthenticationInteractor = "AuthenticationInteractor",

    DatabaseRepository = "DatabaseRepository",

    PostgresDatabaseService = "PostgresDatabaseService",
    MongoDBDatabaseService = "MongoDBDatabaseService",
}
