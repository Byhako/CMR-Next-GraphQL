const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');

const resolvers = {
  Query: {
    obtenerCurso: () => 'algo'
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;
      // Verificar si el usuario ya existe
      const existeUsuario = await Usuario.findOne({email});
      if (existeUsuario) {
        throw new Error('El usuario ya existe.');
      }

      // Hashear password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      // Guardarlo
      try {
        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = resolvers;
