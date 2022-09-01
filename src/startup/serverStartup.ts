import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "../routes";

import { initIoCContainer } from "../ioc/ioc.init";

const PORT = process.env.PORT || 5000;

export function startServer() {
    initIoCContainer();

    const app = express();

    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    app.use(cookieParser());

    routes(app);

    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`);
    });
}
