const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const db = require('../../database');
const { UserType } = require('./types');
const mutations = require('./mutations');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {type: GraphQLString}
      },
      resolve(parentValue, args, request) {
        if (args.id) {
          return db.User.get({id: args.id}).catch(console.log);
        } else if (request.user) {
          return db.User.get({id: request.user.id});
        } else {
          return Promise.reject('You are not logged in');
        }
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: mutations
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});