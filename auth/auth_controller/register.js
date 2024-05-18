import { AuthModal } from "../auth_schema/index.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRETKEY = process.env.SECRET_KEY;

const saltRounds = 10;

const register = async (req, res) => {
  const { userName, signupEmail, signupPassword } = req.body;
  //validation user
  const userSchema = Joi.object({
    userName: Joi.string().min(2).max(24).required(),
    signupEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "pk"] },
      })
      .required(),
    signupPassword: Joi.string().min(6).required(),
  });
  //validated user
  const validationResult = userSchema.validate(req.body);
  if (validationResult.error) {
    res.status(400).send({
      status: 400,
      message: validationResult.error.details[0].message,
    });
  } else {
    const hashPassword = await bcrypt.hash(signupPassword, saltRounds);
    try {
      // if user already exist
      const userExist = await AuthModal.findOne({ email: signupEmail });
      if (userExist) {
        return res.status(400).send({
          status: "400",
          message: "User already exsit",
        });
      } else {
        // create user
        const addUser = await AuthModal.create({
          name: userName,
          email: signupEmail,
          password: hashPassword,
        }).then((res) => res.toObject());
        delete addUser.password;
        const token = jwt.sign({ id: addUser._id }, SECRETKEY);
        res.status(201).send({
          addUser,
          token,
          status: "User added successfully",
        });
      }
    } catch (error) {
      res.status(500).send({
        error: "Internal server error",
        error,
      });
    }
  }
};
export { register };
