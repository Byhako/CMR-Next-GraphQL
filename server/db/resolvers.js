const resolvers = {
  Query: {
    obtenerCurso: () => 'algo'
  },
  Mutation: {
    nuevoUsuario: (_, { input }) => {
      console.log(input);
      return 'Creando...';
    }
  }
}

module.exports = resolvers;
