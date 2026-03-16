import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";
import { GraphQLContext } from "./context";
import { APP_SECRET } from "./auth";
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { Link, User } from "./generated/prisma/client";

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
        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated!")
            }
            return context.currentUser
        }
    },
    Mutation: {
        post: async (parent: unknown,
                    args: { description: string, url: string },
                    context: GraphQLContext
                ) => {
            
            if (context.currentUser === null) {
                throw new Error("Not authenticated to post!")
            }
                        
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                    postedBy: { connect: {id: context.currentUser.id } } // CONNECT post to current User
                }
            });

            return newLink
        },
        signup: async(
            parent: unknown,
            args: {email: string, password: string, name: string},
            context: GraphQLContext
        ) => {
                // Hash our password
                const password = await hash(args.password, 10);

                const user = await context.prisma.user.create({
                    data: {
                        name: args.name,
                        email: args.email,
                        password: password
                    }
                })

                // Create valid token for user
                const token = sign({ userId: user.id }, APP_SECRET)

                return {
                    token,
                    user
                }
        },
        login: async(
            parent: unknown,
            args: {email: string, password: string},
            context: GraphQLContext
        ) => {
            const user = await context.prisma.user.findUniqueOrThrow({
                where: {email: args.email}
            })

            const valid = await compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid password!")
            } 

            const token = sign({ userId: user.id }, APP_SECRET)

            return {
                token,
                user
            }
        }
    },
    Link: {
        // Below is technically optional, GraphQL resolves it automatically
        // id: (parent: Link) => parent.id,
        // url: (parent: Link) => parent.url,
        // description: (parent: Link) => parent.description,
        postedBy: async (parent: Link, args: {}, context: GraphQLContext) => {
            if (!parent.postedById) {
                return null;
            }

            // We retrieve postedBy by looking for it in the DB!
            return context.prisma.link
                    .findUnique({ where: {id: parent.id }})
                    .postedBy();
        }
    },
    User: {
        links: (parent: User, args: {}, context: GraphQLContext) => {
            context.prisma.user
                .findUnique({where: {id: parent.id} })
                .links()
        }
    }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});