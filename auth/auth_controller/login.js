import { AuthModal } from "../auth_schema/index.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRETKEY = process.env.SECRET_KEY;

const login = async (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  console.log(req.body);
  // validation user
  const userSchema = Joi.object({
    loginEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "pk"] },
      })
      .required(),
    loginPassword: Joi.string().min(6).required(),
  });
  // validated user
  const validateResult = userSchema.validate(req.body);
  if (validateResult.error) {
    res
      .status(400)
      .send({ status: 400, message: validateResult.error.details[0].message });
  } else {
    try {
      const userExist = await AuthModal.findOne({ email: loginEmail }).then(
        (res) => res?.toObject()
      );
      if (userExist) {
        console.log(userExist);
        const matchPassword = await bcrypt.compare(
          loginPassword,
          userExist.password
        );
        if (matchPassword) {
          delete userExist.password;
          const token = jwt.sign({ id: userExist._id }, SECRETKEY);
          res.status(200).send({
            userExist,
            token,
            status: "Logged in successfully",
          });
        } else {
          res.status(401).send({
            status: "wrong password",
          });
        }
      } else {
        res.status(404).send({
          status: "user not found",
        });
      }
    } catch (error) {
      res.status(500).send({
        err: error,
        status: 500,
      });
    }
  }
};

export { login };
