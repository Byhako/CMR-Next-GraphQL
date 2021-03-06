const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

const crearToken = (usuario, secreta, expiresIn) => {
  const { id, nombre, apellido, email } = usuario;
  return jwt.sign({ id, nombre, apellido, email }, secreta, { expiresIn });
}

const resolvers = {
  Query: {
    obtenerUsuario: async (_, {}, ctx) => {
      return ctx.usuario;
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
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toSting()});
        return clientes;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      try {
        // Verificar si exite
        const cliente = await Cliente.findById(id);
        if (!cliente) {
          throw new Error('El cliente no existe.');
        }
  
        // Quien lo creo puede verlo
        if (cliente.vendedor-toString() !== ctx.usuario.id) {
          throw new Error('Acceso denegado!');
        }
        return cliente;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerPedidos: async () => {
      try {
        const pedidos = await Pedido.find({});
        return pedidos;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      try {
        const pedidos = await Pedido.find({ vendedor: ctx.usuario.id });
        return pedidos;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      try {
        // Si el pedido exite
        const pedido = await Pedido.findById(id);
        if (!pedido) {
          throw new Error('El pedido no exite.')
        }

        // solo quien lo creo
        if (pedido.vendedor.toSting() !== ctx.usuario.id) {
          throw new Error('Acceso denegado.')
        }

        // retornar resultado
        return pedido;
      } catch (error) {
        console.error(error);
      }
    },
    obtenerPedidosEstado: async (_, { estado }, ctx) => {
      try {
        const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });
        return pedidos;
      } catch (error) {
        console.error(error);
      }
    },
    mejoresClientes: async () => {
      const clientes = await Pedido.aggregate([
        { $match: { estado: 'COMPLETADO' } },
        { $group: {
          _id: '$cliente',
          total: { $sum: '$total' }
        }},
        {
          $lookup: {
            from: 'clientes',
            localField: '_id',
            foreignField: '_id',
            as: 'cliente   '
          }
        },
        { $limit: 9 },
        {
          $sort: { total: -1 }
        }
      ]);
      return clientes;
    },
    mejoresVendedores: async () => {
      const vendedores = await Pedido.aggregate([
        { $match: { estate: 'COMPLETADO' } },
        {
          $group: {
            _id: 'vendedor',
            total: { $sum: 'total' }
          }
        },
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: '_id',
            as: 'vendedor'
          }
        },
        { $limit: 9 },
        { $sort: { total: -1 } }
      ]);
      return vendedores;
    },
    buscarProducto: async (_, { texto }) => {
      const productos = await Producto.find({ $text: { $search: texto }}).limit(20);
      return productos;
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
    actualizarProducto: async (_, { id, input }) => {
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
    },
    nuevoCliente: async (_, { input }, ctx) => {
      const { email } = input;
      // Verificar si el cliente exite
      const cliente = await Cliente.findOne({email});
      if (cliente) {
        throw new Error('El cliente ya existe.');
      }
      // Asignar el vendedor
      const nuevoCliente = new Cliente(input);
      nuevoCliente.vendedor = ctx.usuario.id;

      // Guardarlo en la base de datos
      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.error(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      // Revisar si extiste
      let cliente = await Cliente.findById(id);
      if(!cliente) {
        throw new Error('Cliente no encontrado.');
      }

      // Verificar si el vendedor es quien edita
      if (cliente.vendedor !== ctx.usuario.id) {
        throw new Error('Acceso denegado.');
      }

      // Guardar en base de datos
      cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
      return cliente;
    },
    eliminarCliente: async (_, { id }, ctx) => {
      // Revisar si extiste
      let cliente = await Cliente.findById(id);
      if(!cliente) {
        throw new Error('Cliente no encontrado.');
      }

      // Verificar si el vendedor es quien edita
      if (cliente.vendedor.toSting() !== ctx.usuario.id) {
        throw new Error('Acceso denegado.');
      }

      // Eliminar
      await Cliente.findOneAndDelete({ _id: id});
      return 'Cliente eliminado.';
    },
    nuevoPedido: async (_, { input }, ctx) => {
      const { cliente } = input;
      // Verificar si cliente existe
      let clienteExiste = await Cliente.findById(cliente);
      if(!clienteExiste) {
        throw new Error('Cliente no encontrado.');
      }
      // Verificar si cliete es del vendedor
      if (clienteExiste.vendedor.toSting() !== ctx.usuario.id) {
        throw new Error('Acceso denegado.');
      }
      // Revisar si hay stock
      for await (const articulo of input.pedido) {
        const { id } = articulo;

        const producto = await Producto.findById(id);

        if (articulo.cantidad > producto.existencia) {
          throw new Error(`El ${producto.nombre} excede la candidad disponible.`);
        } else {
          // Restar cantidad en disponible
          producto.existencia = producto.existencia - articulo.cantidad;
          await producto.save();
        }
      }
      // Crear pedido
      const pedido = new Pedido(input);
      // Asignar vendedor
      pedido.vendedor = ctx.usuario.id;

      // Guardar en DB
      const resultado = pedido.save();
      return resultado;
    },
    actualizarPedido: async (_, { id, input }, ctx) => {
      try {
        // si el pedido exite
        const pedido = await Pedido.findById(id);
        if (!pedido) {
          throw new Error ('El pedido no exite');
        }

        // si el cliente existe
        const cliente = await Cliente.findById(input.cliente);
        if (!cliente) {
          throw new Error ('El cliente no exite');
        }

        // si cliente y pedido pertenece al vendedor
        if (cliente.vendedor.toSting() !== ctx.usuario.id) {
          throw new Error('Acceso denegado.');
        }

        // Revisar si hay stock
        if (input.pedido) {
          for await (const articulo of input.pedido) {
            const { id } = articulo;

            const producto = await Producto.findById(id);

            if (articulo.cantidad > producto.existencia) {
              throw new Error(`El ${producto.nombre} excede la candidad disponible.`);
            } else {
              // Restar cantidad en disponible
              producto.existencia = producto.existencia + pedido.pedido.cantidad - articulo.cantidad;
              await producto.save();
            }
          }
        }
        // Crear pedido
        const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
        return resultado;
      } catch (error) {
        console.error(error)
      }
    },
    eliminarPedido: async (_, { id }, ctx) => {
      try {
        // Revisar si extiste
        let pedido = await Pedido.findById(id);
        if(!pedido) {
          throw new Error('Pedido no encontrado.');
        }

        // Verificar si el vendedor es quien edita
        if (pedido.vendedor.toSting() !== ctx.usuario.id) {
          throw new Error('Acceso denegado.');
        }

        // Eliminar
        await Pedido.findOneAndDelete({ _id: id});
        return 'Pedido eliminado.';
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = resolvers;
