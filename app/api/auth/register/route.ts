import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Auth from "@/lib/models/auth";
import connect from "@/lib/db";
import bcrypt from "bcryptjs";

export const POST = async (request: Request, response: Response) => {
    try {
        const { username, password, email, role } = await request.json()
        if (!username || !password || !email) {
            return new NextResponse(JSON.stringify({ message: "All fields are required" }), { status: 400 })
        }
        const hashPassword= await bcrypt.hash(password, 10)
        await connect()
        const existUser = await Auth.findOne({ $or: [{ username }, { email }] })
        if (existUser) {
            return new NextResponse(JSON.stringify({ message: "Username or email already exists" }), { status: 400 })
        }
        const user = await Auth.create({ username, password: hashPassword, email, role })
        await user.save()
        return new NextResponse(JSON.stringify({ message: "User created successfully" }), { status: 201 })

    }
    catch (error: any) {
        return new NextResponse("error", error)
    }
}

