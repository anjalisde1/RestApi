import { request } from "http";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blogs";
import { title } from "process";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";


export const GET = async (request: Request) => {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Authentication token missing or invalid" },
                { status: 401 }
            );
        }

        // Verify and decode the JWT token
        const token = authHeader.split(" ")[1];
        let decodedToken: string | JwtPayload;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        // Use a type guard to ensure the decodedToken is a JwtPayload
        if (typeof decodedToken !== "object" || !decodedToken) {
            return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
        }

        // Check if the decoded token has a valid user ID
        const userIdFromToken = (decodedToken as JwtPayload).id;
        if (!userIdFromToken || !Types.ObjectId.isValid(userIdFromToken)) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")
        const searchKeywords = searchParams.get("keywords") as string
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "user not found or invalid" }))
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "category not found or invalid" }))
        }
        await connect()
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }))

        }
        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        }

        if (searchKeywords) {
            filter.$or = [
                {
                    title: { $regex: searchKeywords, $options: "i" }
                },
                {
                    description: { $regex: searchKeywords, $options: "i" }
                }
            ]
        }
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        else if (startDate) {
            filter.createdAt = {
                $gte: new Date(startDate),

            }
        }
        else if (endDate) {
            filter.createdAt = {
                $lte: new Date(endDate),

            }
        }
        // const blogs = await Blog.find(filter)
        const blogs = await Blog.find(filter).sort({ createdAt: "asc" })
        if (!blogs) {
            return new NextResponse(JSON.stringify({ message: "blogs not found" }))

        }
        return new NextResponse(JSON.stringify({ message: "blogs fetched", blog: blogs }))

    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")
        const body = await request.json()
        const { title, description } = body
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "wrong user id" }))
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "wrong category id" }))
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const category = await Category.findById(categoryId)
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "category not found" }))
        }

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        })
        await newBlog.save()
        if (!newBlog) {
            return new NextResponse(JSON.stringify({ message: "failed to create blog" }))

        }
        return new NextResponse(JSON.stringify({ message: "blog created", blog: newBlog }))

    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}