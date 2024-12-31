import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Auth from "@/lib/models/auth";
import connect from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";



export const POST= async (request: Request, response: Response) => {
    try {
        const { username, password } = await request.json()
        if (!username ||!password) {
            return new NextResponse(JSON.stringify({ message: "All fields are required" }), { status: 400 })
        }
        await connect()
        const user = await Auth.findOne({ username })
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 })
        }
        const token= jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" })

        return new NextResponse(JSON.stringify({ message: "Login successful", user, token }), { status: 200 })
}
    catch (error: any) {
        return new NextResponse("error", error)
    }
}