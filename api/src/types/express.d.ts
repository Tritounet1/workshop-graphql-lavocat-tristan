import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: { id: id, email: string; role: string; iat: number };
        }
    }
}

