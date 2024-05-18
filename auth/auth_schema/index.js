import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const authSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const AuthModal = model("users", authSchema);
export { AuthModal };
