import * as core from "express-serve-static-core";
import bodyParser from "body-parser";

import { createUser, getUser, loginUser, logoutUser } from "./endpoints/authentication.endpoints";

const routes = (app: core.Express) => {
    const jsonParser = bodyParser.json();

    app.post("/login", jsonParser, loginUser);

    app.post("/logout", logoutUser);

    app.post("/user", jsonParser, createUser);

    app.get("/user", getUser);
}

export default routes;
