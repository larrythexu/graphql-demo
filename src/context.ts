import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient, User } from "../src/generated/prisma/client"
import { FastifyRequest } from "fastify"
import { authenticateUser } from "./auth"


const connection_string = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connection_string })
const prisma = new PrismaClient({ adapter })

export type GraphQLContext = {
    prisma: PrismaClient;
    currentUser: User | null
}

// Establish our DB connection here, pass it as context to GraphQL resolvers
export async function contextFactory(
    request: FastifyRequest
): Promise<GraphQLContext> {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, request)
    }
}