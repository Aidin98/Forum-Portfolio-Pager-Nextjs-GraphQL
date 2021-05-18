const mongoose=require('mongoose')
const config=require('../config/dev')
const fakeDb=require('./FakeDb')


  mongoose.connect(
    config.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    },
    async () => {
      console.log("starting populating db");
      await fakeDb.populate();
      await mongoose.connection.close();
      console.log("db has been populated");
    }
  );

