import { PrismaClient, User } from "./generated/prisma/client";
import { FastifyRequest } from "fastify";
import { JwtPayload, verify } from "jsonwebtoken";
import "dotenv/config"

export const APP_SECRET = process.env.APP_SECRET!;

export async function authenticateUser(prisma: PrismaClient, request: FastifyRequest): Promise<User | null> {
    if (request?.headers?.authorization) {
        const token = request.headers.authorization.split(" ")[1]
        
        if (token == undefined) {
            throw new Error("Auth token not found")
        }

        const tokenPayload = verify(token, APP_SECRET) as JwtPayload;

        const userId = tokenPayload.userId;

        return await prisma.user.findUniqueOrThrow({
            where: { id: userId }
        })
    }

    return null
}