import { DocumentNode, GraphQLSchema } from "graphql";
import { IResolvers } from "@graphql-tools/utils";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefsArray = loadFilesSync(`${__dirname}/**/*.typeDefs.{js,ts}`);
const resolversArray = loadFilesSync(`${__dirname}/**/*.resolvers.{js,ts}`);

const mergedTypeDefs: DocumentNode = mergeTypeDefs(typeDefsArray);
const mergedResolvers: IResolvers = mergeResolvers(resolversArray);

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs: mergedTypeDefs, resolvers: mergedResolvers });

export default schema;
