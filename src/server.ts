import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { handleGetLoggedInUser, handleProtectResolver } from "./users/users.utils";
import { User } from ".prisma/client";

const server: ApolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const foundUser: User | null = await handleGetLoggedInUser(req.headers.token);
    return { loggedInUser: foundUser };
  },
});

server.listen(process.env.PORT, (): void => {
  console.log(`🚀 Apollo Server: http://localhost:${process.env.PORT}`);
});
