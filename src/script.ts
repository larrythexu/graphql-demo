import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../src/generated/prisma/client"

const connection_string = `${process.env.DATABASE_URL}`
const adapter = new PrismaBetterSqlite3({ url: connection_string })
const prisma = new PrismaClient({ adapter })

async function main() {
    const newLink = await prisma.link.create({
        data: {
            description: "prisma client stuff",
            url: "https://www.prisma.io/docs/orm/reference/prisma-client-reference"
        },
    });


    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })