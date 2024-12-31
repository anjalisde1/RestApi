import { Schema, model, models } from "mongoose";
import { title } from "process";
const blogSchema = new Schema({
    title: { type: String },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: Schema.Types.ObjectId, ref: 'Categotry' }
}, {
    timestamps: true
})

const Blog = models.Blog || model("Blog", blogSchema)
export default Blog