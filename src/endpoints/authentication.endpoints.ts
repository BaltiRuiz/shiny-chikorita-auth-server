import { Request, Response } from "express";
import jwtDecode from "jwt-decode";

import { DIKeys } from "../ioc/ioc.enums";
import { AppContainerInstance } from "../ioc/ioc.init";

import { AuthenticationInteractor } from "../interactors/authentication.interactors";

import {
    InvalidPasswordConfirmationError,
    UserAlreadyExistsError,
    InvalidPasswordError,
    UserNotFoundError,
} from "../errors/authentication.errors";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const userName = req.body.name;
        const userPassword = req.body.password;

        const authenticationBL: AuthenticationInteractor = AppContainerInstance.getContainerItem(
            DIKeys.AuthenticationInteractor,
        );

        const userToken = await authenticationBL.loginUser(userName, userPassword);

        res.cookie(
            "access-token",
            userToken,
            { httpOnly: true, sameSite: "none" },
        ).cookie(
            "check-token",
            true,
            { sameSite: "none" },
        ).status(204).send();
    } catch (error) {
        if (error instanceof InvalidPasswordError) {
            res.status(400).send(error.message);
        } else if (error instanceof UserNotFoundError) {
            res.status(404).send(error.message);
        } else {
            res.status(500).send("There was an internal error while login the user");
        }
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("access-token").status(204).send();
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const userName = req.body.name;
        const userPassword = req.body.password;
        const userPasswordConfirmation = req.body.passwordConfirmation;

        const authenticationInteractor: AuthenticationInteractor = AppContainerInstance.getContainerItem(
            DIKeys.AuthenticationInteractor,
        );

        const newUserToken = await authenticationInteractor.registerUser(userName, userPassword, userPasswordConfirmation);

        res.cookie(
            "access-token",
            newUserToken,
            { httpOnly: true, secure: true, sameSite: "none" },
        ).cookie(
            "check-token",
            true,
            { secure: true, sameSite: "none" },
        ).status(204).send();
    } catch (error) {
        if (error instanceof InvalidPasswordConfirmationError) {
            res.status(400).send(error.message);
        } else if (error instanceof UserAlreadyExistsError) {
            res.status(409).send(error.message);
        } else {
            res.status(500).send("There was an internal error while registering the user");
        }
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const userToken = req.cookies["access-token"];

        const decodedToken: any = jwtDecode(userToken);

        res.status(200).send(
            { name: decodedToken.name },
        );
    } catch (error) {
        res.status(500).send("There was an internal error while decoding user token");
    }
}
