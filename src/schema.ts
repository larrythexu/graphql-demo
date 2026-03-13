import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { GraphQLContext } from "./context";
import { Link } from "./generated/prisma/client";

// placeholder links
// type Link = {
//     id: string;
//     url: string;
//     description: string;
// }
// const links: Link[] = [{
//     id: 'link-0',
//     url: 'www.bruh.com',
//     description: 'ay dingus'
// }]

const resolvers = {
    Query: {
        info: () => "Test API for Hacker News",
        feed: async (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findMany();
        },
    },
    Mutation: {
        post: async (parent: unknown,
                    args: { description: string, url: string },
                    context: GraphQLContext) => {
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            });

            return newLink
        },
    }
    // This is technically optional, GraphQL resolves it automatically
    // Link: {
    //     id: (parent: Link) => parent.id,
    //     url: (parent: Link) => parent.url,
    //     description: (parent: Link) => parent.description,
    // }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});