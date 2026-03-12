import 'graphql-import-node';
import { getGraphQLParameters, processRequest, Request, sendResult, renderGraphiQL, shouldRenderGraphiQL } from "graphql-helix";
import { schema } from "./schema";
import fastify from 'fastify';
import { get } from 'node:http';

async function main() {
    const server = fastify();

    server.get('/', async (request, reply) => {
        reply.send({ test: true });
    });

    // Creating POST endpoint for /graphql
    server.route({
        method: ['GET', 'POST'],
        url: '/graphql',
        // Build a GraphQL Request from raw HTTP
        handler: async (req, reply) => {
            const request: Request = {
                headers: req.headers,
                method: req.method,
                query: req.query,
                body: req.body,
            }

            if (shouldRenderGraphiQL(request)) {
                // If the request is from a browser, show GraphiQL
                reply.header('Content-Type', 'text/html');
                reply.send(renderGraphiQL({
                    endpoint: '/graphql',
                }));

                return;
            }

            // GraphQL Helix extracts info from the request
            const { operationName, query, variables } = getGraphQLParameters(request);

            // Run the query
            const result = await processRequest({
                request,
                schema,
                operationName,
                query,
                variables,
            });

            sendResult(result, reply.raw);
        }
    });

    server.listen({ port: 3000 }, () => {
        console.log("Server is running on http://localhost:3000");
    });

    // const myQuery = parse(`query { info }`);

    // const result = await execute({
    //     schema,
    //     document: myQuery,
    // });

    // console.log(result);
}

main();