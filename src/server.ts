import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { handleGetLoggedInUser, handleCheckLogin } from "./users/users.utils";
import { User } from ".prisma/client";
import schema from "./schema";
import prisma from "./prisma";

const server: ApolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const foundUser: User | null = await handleGetLoggedInUser(req.headers.token);
    return { prisma, loggedInUser: foundUser, handleCheckLogin };
  },
});

server.listen(process.env.PORT, (): void => {
  console.log(`🚀 Apollo Server: http://localhost:${process.env.PORT}`);
});
