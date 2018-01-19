const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } = require('graphql');
const { UserType } = require('../types');
const db = require('../../../database');

module.exports = {
  editUser: {
    type: UserType,
    args: {
      email: {type: GraphQLString},
      username: {type: GraphQLString},
      theme: {type: GraphQLInt},
      name: {type: GraphQLString},
      profession: {type: GraphQLString},
      avatarUrl: {type: GraphQLString},
      description: {type: GraphQLString}
    },
    resolve(parentValue, args, request) {
      if (!request.user) {
        return Promise.reject('You are not logged in');
      }
      return db.User.update(request.user.id, args);
    }
  }
};