const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } = require('graphql');
const db = require('../../database');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    oAuthProvider: {type: GraphQLString},
    oAuthId: {type: GraphQLString},
    friends: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return db.User.getFollowers(parentValue.id);
      }
    }
  })
});

module.exports = {
  UserType
};