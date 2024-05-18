import express from "express";
import { register } from "../auth_controller/register.js";
import { login } from "../auth_controller/login.js";

const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/login", login);

export { authRouter };
