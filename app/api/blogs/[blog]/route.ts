import { request } from "http";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { types } from "util";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blogs";
export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog
    try {
        const { searchParams } = new URL(request.url)
        const { title, description } = await request.json()
        const userId = searchParams.get("userId")
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "wrong userid" }))

        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "wrong blogid" }))

        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not exist" }))

        }
        const newBlog = await Blog.findOne({
            _id: blogId,
            user: userId,
        })
        if (!newBlog) {
            return new NextResponse(JSON.stringify({ message: "blog not exist" }))

        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true },
        )
        if (!updatedBlog) {
            return new NextResponse(JSON.stringify({ message: "issue in blog patch" }))

        }
        return new NextResponse(JSON.stringify({ message: "blog patched", blogss: updatedBlog }))
    }
    catch (err: any) {
        return new NextResponse("error", err)
    }

}
export const DELETE = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "wrong userid" }))

        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "wrong blogid" }))

        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not exist" }))

        }
        const newBlog = await Blog.findOne({
            _id: blogId,
            user: userId,
        })
        if (!newBlog) {
            return new NextResponse(JSON.stringify({ message: "blog not exist" }))

        }
        const deletedBlog = await Blog.findByIdAndDelete(
            blogId,
        )
        if (!deletedBlog) {
            return new NextResponse(JSON.stringify({ message: "issue in blog patch" }))

        }
        return new NextResponse(JSON.stringify({ message: "blog deleted", blogss: deletedBlog }))
    }
    catch (err: any) {
        return new NextResponse("error", err)
    }

}