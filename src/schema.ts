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

    // This is technically optional, GraphQL resolves it automatically
    Link: {
        id: (parent: Link) => parent.id,
        url: (parent: Link) => parent.url,
        description: (parent: Link) => parent.description,
    }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});