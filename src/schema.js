import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefsArray = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const resolversArray = loadFilesSync(`${__dirname}/**/*.{queries,mutations}.js`);

const mergedTypeDefs = mergeTypeDefs(typeDefsArray);
const mergedResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs: mergedTypeDefs, resolvers: mergedResolvers });

export default schema;
