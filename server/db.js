const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mapstory-backend', {useMongoClient: true});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected');
});
