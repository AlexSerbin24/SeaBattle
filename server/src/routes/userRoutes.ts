import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/login", UserController.login);
userRouter.post("/registration", UserController.register);
userRouter.post("/logout", UserController.logout);
userRouter.post("/refresh", UserController.refresh);

export default userRouter;