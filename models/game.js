const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
{
  "title":"",
  "price":,
  "reviews":,
  "realaseDate":"",
  "developer":"",
  "publisher":""
}
*/
const Game = new Schema({
  title:String,
  price:Number,
  reviews:Number,
  realaseDate:Date,
  developer:String,
  publisher:String
});

//insert new game
Game.statics.create =function({title,price,reviews,realaseDate,developer,publisher}){
  const game = new this({
    title,
    price,
    reviews,realaseDate,
    developer,
    publisher
  });

  return game.save();
}

//find title
Game.statics.findOneByTitle = function(title){
  return this.findOne({
    title
  }).exec();
}

module.exports = mongoose.model('Game',Game);