const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

const crearToken = (usuario, secreta, expiresIn) => {
  const { id, nombre, apellido, email } = usuario;
  return jwt.sign({ id, nombre, apellido, email }, secreta, { expiresIn });
}

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRETO);
      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      // Revisar si extiste
      const producto = await Producto.findById(id);

      if(!producto) {
        throw new Error('Producto no encontrado.');
      }
      return producto;
    }
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
    },
    autenticarUsuario: async (_, { input }) => {
      // El usuario exite?
      const { email, password } = input;
      const existeUsuario = await Usuario.findOne({email});
      if (!existeUsuario) {
        throw new Error('El usuario no existe.');
      }

      // Password correcto
      const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
      if (!passwordCorrecto){
        throw new Error('El password es incorrecto.');
      }

      // Token
      return { token: crearToken(existeUsuario, process.env.SECRETO, '24h') }
    },
    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        // Guardar en base de datos
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.error(error);
      }
    },
    autenticarProducto: async (_, { id, input }) => {
       // Revisar si extiste
      let producto = await Producto.findById(id);

      if(!producto) {
        throw new Error('Producto no encontrado.');
      }

      // Guardar en base de datos
      producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
      return producto;
    },
    eliminarProducto: async (_, { id }) => {
      // Revisar si extiste
      let producto = await Producto.findById(id);

      if(!producto) {
        throw new Error('Producto no encontrado.');
      }

      // Eliminar
      await Producto.findOneAndDelete({ _id: id});
      return 'Producto eliminado.';
    }
  }
}

module.exports = resolvers;
