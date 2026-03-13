import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";

type Link = {
    id: string;
    url: string;
    description: string;
}

// placeholder links
const links: Link[] = [{
    id: 'link-0',
    url: 'www.bruh.com',
    description: 'ay dingus'
}]

const resolvers = {
    Query: {
        info: () => "Test API for Hacker News",
        feed: () => links,
    },
    Mutation: {
        post: (parent: unknown, args: { description: string, url: string }) => {
            let newId = links.length

            const newLink: Link = {
                id: `link-${newId++}`,
                url: args.url,
                description: args.description
            }

            links.push(newLink)
            return newLink
        }
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