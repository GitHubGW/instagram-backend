import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";
import { DocumentNode, GraphQLSchema } from "graphql";

const typeDefsArray: any[] = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const resolversArray: any[] = loadFilesSync(`${__dirname}/**/*.resolvers.ts`);

const mergedTypeDefs: DocumentNode = mergeTypeDefs(typeDefsArray);
const mergedResolvers: IResolvers = mergeResolvers(resolversArray);

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs: mergedTypeDefs, resolvers: mergedResolvers });

export default schema;
