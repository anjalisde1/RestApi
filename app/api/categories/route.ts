import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { request } from "http";
import connect from "@/lib/db";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "invalid creds" }))
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const category = await Category.find({
            user: new Types.ObjectId(userId)
        })
        return new NextResponse(JSON.stringify({ message: "category fetched", category: category }))

    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = await searchParams.get("userId")
        const { title } = await request.json()
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "invaild creds" }))
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId)
        })
        await newCategory.save()
        return new NextResponse(JSON.stringify({ message: "category added", category: newCategory }))
    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}