const { connect, connection } = require('mongoose');

connect('mongodb://localhost/socializeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;