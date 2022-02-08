import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema.js";

const server = new ApolloServer({
  schema,
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Apollo Server: http://localhost:${process.env.PORT}`);
});
