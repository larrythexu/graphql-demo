import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../src/generated/prisma/client"

const connection_string = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connection_string })
const prisma = new PrismaClient({ adapter })

export type GraphQLContext = {
    prisma: PrismaClient;
}

// Establish our DB connection here, pass it as context to GraphQL resolvers
export async function contextFactory(): Promise<GraphQLContext> {
    return {
        prisma
    }
}