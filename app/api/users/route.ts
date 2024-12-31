import { NextRequest, NextResponse } from "next/server"
import connect from "@/lib/db"
import User from "@/lib/models/user"
import { request } from "http"
import { ObjectId } from "mongodb"
import { Types } from "mongoose"
import { url } from "inspector"

export const GET = async () => {
    try {
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users))
    }
    catch (err: any) {
        return new NextResponse("err", err)

    }
}
export const POST = async (request: Request) => {
    try {

        const body = await request.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()
        return new NextResponse(JSON.stringify({ message: 'user created', user: newUser }))
    }
    catch (err: any) {
        return new NextResponse("err", err)

    }

}
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const { userId, newusername, newpassword } = body
        await connect()
        if (!userId || !newusername) {
            return new NextResponse(JSON.stringify({ message: "userid not found" }))
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "userid invalid" }))

        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newusername },
            // { password: newpassword },
            { new: true }

        )
        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "user not found" }))

        }
        return new NextResponse(JSON.stringify({ message: "user updated", user: updatedUser }))


    }
    catch (err: any) {
        return new NextResponse("error", err)
    }
}
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "userid not found" }))
        }

        if (!Types.ObjectId.isValid) {
            return new NextResponse(JSON.stringify({ message: "userid invalid" }))
        }
        await connect()
        const deleteUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )
        if (!deleteUser) {
            return new NextResponse(JSON.stringify({ message: "user not found in db" }))

        }
        return new NextResponse(JSON.stringify({ message: "user deleted", user: deleteUser }))
    } catch (err: any) {
        return new NextResponse("error", err)

    }

}
