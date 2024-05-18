import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./auth/auth_router/routerAuth.js";
import "dotenv/config";

mongoose.connect(process.env.DBURI);

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

mongoose.connection.on("connected", () => console.log("DB CONNECTED"));

app.listen(3000, () => {
  console.log(new Date());
});
