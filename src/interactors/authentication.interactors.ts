import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { IUser } from "../database/database.interfaces";

import { IDatabaseRepository } from "../ports/database.ports";

import {
    InvalidPasswordConfirmationError,
    InvalidPasswordError,
    UserAlreadyExistsError,
    UserNotFoundError,
} from "../errors/authentication.errors";

/**
 * Manages authentication business logic
 * 
 * @class AuthenticationInteractor
 */
export class AuthenticationInteractor {
    /**
     * Creates an instance of AuthenticationInteractor
     *
     * @param {IDatabaseRepository} DatabaseRepository
     * 
     * @memberof AuthenticationInteractor
     */
    constructor(
        private DatabaseRepository: IDatabaseRepository
    ) {}

    /**
     * Gives a user access to the application
     *
     * @param {string} userName
     * @param {string} userPassword
     * 
     * @memberof AuthenticationInteractor
     */
    public async loginUser(userName: string, userPassword: string) {
        const user: IUser = await this.DatabaseRepository.getUserByName(userName);

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(userPassword, user.password);

            if (isPasswordCorrect) {
                return jwt.sign(
                    { id: user.id, name: user.name },
                    process.env.API_KEY,
                    { expiresIn: process.env.TOKEN_EXPIRATION },
                );
            } else {
                throw new InvalidPasswordError();
            }
        } else {
            throw new UserNotFoundError(userName);
        }
    }

    /**
     * Adds a new user to the application
     *
     * @param {string} userName
     * @param {string} userPassword
     * @param {string} userPasswordConfirmation
     * 
     * @memberof AuthenticationInteractor
     */
    public async registerUser(userName: string, userPassword: string, userPasswordConfirmation: string) {
        const user: IUser = await this.DatabaseRepository.getUserByName(userName);

        if (user) {
            throw new UserAlreadyExistsError(userName);
        } else {
            if (userPassword === userPasswordConfirmation) {
                const encryptedPassword = await bcrypt.hash(userPassword, 10);

                const newUser: IUser = await this.DatabaseRepository.createUser(userName, encryptedPassword);

                return jwt.sign(
                    { id: newUser.id, name: newUser.name },
                    process.env.API_KEY,
                    { expiresIn: process.env.TOKEN_EXPIRATION },
                );
            } else {
                throw new InvalidPasswordConfirmationError();
            }
        }
    }
}
