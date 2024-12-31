import { Schema, model, models } from "mongoose";
import { title } from "process";
const userSchema=new Schema({
    email: {type: String, },
    username: {type: String},
    password: {type: String}
})
const User= models.User || model("User", userSchema)
export default User