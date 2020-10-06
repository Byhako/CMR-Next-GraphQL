const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDb = require('./config/db');

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

conectarDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    const token = req.headers['authorization']  || '';
    if (token) {
      try {
        const usuario = await jwt.verify(token, process.env.SECRETO);
        return { usuario }
      } catch (error) {
        console.error(error);
      }
    }
  }
});

server.listen().then(({url}) => {
  console.log(`Server run in ${url}`);
});
