

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const {DB_URI} = require('../config/dev');

require('./models/portfolio');
require('./models/user');
require('./models/forumCategory');
require('./models/topic');
require('./models/post');

exports.connect = () => {
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, () => {
    console.log('Connected to DB')
  })
}

exports.initSessionStore = () => {
  const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'portfolioSessions'
  });

  return store;
}
