import { request } from "http";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import connect from "@/lib/db";
import User from "@/lib/models/user";
export const PATCH = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category
    try {
        //get data from user
        const body = await request.json()
        const { title } = body
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "invlid creds" }))
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "invlid creds2" }))
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const newCategory = await Category.findOne({
            _id: categoryId,
            user: userId
        })
        if (!newCategory) {
            return new NextResponse(JSON.stringify({ message: "not exist" }))

        }
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }

        )
        if (!updatedCategory) {
            return new NextResponse(JSON.stringify({ message: "fali to patch" }))

        }
        return new NextResponse(JSON.stringify({ message: "successfully patched", updatedCategory: updatedCategory }))



    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "invlid creds" }))
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "invlid creds2" }))
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        const newCategory = await Category.findOne({
            _id: categoryId,
            user: userId
        })
        if (!newCategory) {
            return new NextResponse(JSON.stringify({ message: "not exist" }))

        }
        const deleteCat = await Category.findByIdAndDelete(
            categoryId
        )
        return new NextResponse(JSON.stringify({ message: "deleted", delete: deleteCat }))
    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}