const Game = require('../../../models/game');

/*
  #list of games
  GET /api/games
*/
exports.findGames = (req,res)=>{
  Game.find({}).then((games)=>{
    res.json({games});
  });
};


/*
  #add games
  POST /api/games
  {
    title,
    price,
    reviews,
    realaseDate,
    developer,
    publisher
  }
 */
exports.addGames = (req,res)=>{
  const newGame = req.body;

  const insert = (title)=>{
    if(title){
      throw new Error('This title already exists.');
    }else{
      return Game.create(newGame);
    }
  }

  const onError = (error)=>{
    res.status(409).json({
      message:error.message
    });
  }
  
  const respond = ()=>{
    res.json({
      message:"succeed in adding a new game"
    })
  }

  Game.findOneByTitle(newGame.title)
  .then(insert)
  .then(respond)
  .catch(onError)
};


/*
  #find games by title
  GET /api/games/:title
*/
exports.findGameTitle = (req,res)=>{
  Game.find({"title":req.params.title}).then((games)=>{
    res.json({games});
  });
};

/*
  #update games
  PUT /api/games/:title
  {
    title,
    price,
    reviews,
    realaseDate,
    developer,
    publisher
  }
*/
exports.updateGames = (req,res)=>{

  const isGame = (game)=>{
    if(!game){
      throw new Error('game not founded')
    }else{
      return game;
    }
  };

  const update = (game)=>{
    if(req.body.title){game.title = req.body.title;}
    if(req.body.price){game.price = req.body.price;}
    if(req.body.reviews){game.reviews = req.body.reviews;}
    if(req.body.realaseDate){game.realaseDate = req.body.realaseDate;}
    if(req.body.developer){game.developer = req.body.developer;}
    if(req.body.publisher){game.publisher = req.body.publisher;}

    game.save();
  }

  const onError = (error)=>{
    res.status(409).json({
      message: error.message
    });
  };

  const respond = ()=>{
    res.json({
      message:"succeed in updating a game"
    });
  };

  Game.findOneByTitle(req.params.title)
  .then(isGame)
  .then(update)
  .then(respond)
  .catch(onError);
};


/*
  #delete games
  DELETE /api/games/:title
*/
exports.deleteGames = (req,res)=>{

  const isGame = (games)=>{
    if(!games){
      throw new Error('game not founded');
    }
  }
  
  const del = ()=>{
    Game.deleteOne({title:req.params.title},(err)=>{
      if(err){throw new Error('database failure')};
    });
  };

  const respond = ()=>{
    res.json({
      message:"succeed in removing a game"
    })
  };

  const onError = (error)=>{
    res.status(409).json({
      message: error.message
    });
  };

  Game.findOneByTitle(req.params.title)
  .then(isGame)
  .then(del)
  .then(respond)
  .catch(onError);
};

/*
  #find games by query of developer or publisher
  GET /api/games/company
  request /api/games/company?dev=${developerName} or
  request /api/games/company?pub=${publisherName}
*/
exports.findGameCompany = (req,res)=>{

  const queryStringParsing = ()=>{
    let option = null;
    let company = null;

    if(req.query.dev)
    {
      option = 0;
      company = req.query.dev;
      
      return {option,company};
    }else if(req.query.pub)
    {
      option = 1;
      company = req.query.pub;

      return {option,company};
    }
  };
  
  const findWithQuery = (company)=>{
    if(company.option == 0)//developer
    {
      Game.find({developer:company.company}).then((games)=>{
        res.json({games});
      });
    }else if(company.option == 1)//publisher
    {
      Game.find({publisher:company.company}).then((games)=>{
        res.json({games});
      });
    }
  };

  const onError = (error)=>{
    res.status(409).json({
      message: error.message
    });
  };

  Promise.resolve(queryStringParsing())
  .then(findWithQuery)
  .catch(onError)
};

/*
  #find games by query of price
  GET /api/games/price
  request /api/games/price?min=${minimum}&max=${maximum}
*/
exports.findGamePrice = (req,res)=>{

  const queryStringParsing = ()=>{
    let min = 0;
    let max = 10000000;

    if(req.query.min&&req.query.max){//min <= PRICE <= max
      min = req.query.min, max = req.query.max;
      return {min,max};
    }else if(!req.query.min&&req.query.max){//0 <= PRICE <= max
      max = req.query.max;
      return {min,max};
    }else if(req.query.min&&!req.query.max){//min <= PRICE <= 10000000
      min = req.query.min;
      return {min,max};
    }else{//0 <= PRICE <= 10000000
      return {min,max};
    }
  };

  const findWithQuery = (query)=>{
    Game.find({price:{$gte:query.min,$lte:query.max}}).then((games)=>{
      res.json({games});
    });
  };

  const onError = (error)=>{
    res.status(409).json({
      message: error.message
    });
  };

  Promise.resolve(queryStringParsing())
  .then(findWithQuery)
  .catch(onError);
};