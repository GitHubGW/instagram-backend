import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";

const server: ApolloServer = new ApolloServer({
  schema,
});

server.listen(process.env.PORT, (): void => {
  console.log(`🚀 Apollo Server: http://localhost:${process.env.PORT}`);
});
