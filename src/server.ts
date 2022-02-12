import "dotenv/config";
import express, { Express } from "express";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { handleGetLoggedInUser, handleCheckLogin } from "./users/users.utils";
import { User } from ".prisma/client";
import prisma from "./prisma";
import schema from "./schema";

const startServer = async () => {
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const foundUser: User | null = await handleGetLoggedInUser(req.headers.token);
      return { prisma, loggedInUser: foundUser, handleCheckLogin };
    },
  });
  await apolloServer.start();

  const app: Express = express();
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app });
  await new Promise<void>((resolve) => app.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
};

startServer();
