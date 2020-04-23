const mongoose = require('mongoose');

const conectarDb = async () => {
  try {
    await mongoose.connect('mongodb://localhost/cmrGraphql', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('Db conectada');
  } catch(error) {
    console.log('ERROR', error);
    process.exit(1);  // detener la app
  }
}

module.exports = conectarDb;
