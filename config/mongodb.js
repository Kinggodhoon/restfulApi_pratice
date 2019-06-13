module.exports = ()=>{
  var mongoose = require('mongoose');
  const dbConfig = require('./db');
  
  mongoose.connect(dbConfig.mongodbUri,{useNewUrlParser:true});
  const db = mongoose.connection;
  
  db.on('error',console.error);
  db.once('open',()=>{
    console.log('connected to mongodb');
  });
}
