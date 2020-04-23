const { gql } = require('apollo-server');


const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String 
  }

  type Query {
    obtenerCurso: String
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  type Mutation {
  """Mutación para crear usuario"""
    nuevoUsuario(input: UsuarioInput): String
  }
`;

module.exports = typeDefs;
