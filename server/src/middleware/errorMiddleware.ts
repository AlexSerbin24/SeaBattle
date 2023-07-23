import ApiError from "../types/errors/ApiError.js";
import { Request,Response,NextFunction } from "express";

export function apiErrorMiddleware(err:Error, req:Request, res:Response, next:NextFunction){
    if(err instanceof ApiError){
        return res.status(err.statusCode).send({message: err.message});
    }

    return res.status(500).send({message: "Something went wrong..."});
}