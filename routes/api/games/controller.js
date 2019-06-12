const Game = require('../../../models/game');
const validator = require('validator');
/*
  #list of games
  GET /api/games
*/
let findGames = (req,res)=>{
  Game.find({},(err)=>{
    if(err){Promise.reject('database error');}
  })
  .then((games)=>{
    res.json({games})
  })
  .catch((error=>{
    res.status(409).json({
      message:error
    });
  }));
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
let addGames = (req,res)=>{
  const newGame = req.body;

  const insert = (title)=>{
    if(title){
      return Promise.reject("This title already exists.");
    }else{
      return Promise.resolve(Game.create(newGame));
    }
  }

  const onError = (error)=>{
    res.status(409).json({
      message:error
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
let findGameTitle = (req,res)=>{
  Game.find({"title":req.params.title},(err)=>{
    if(err){return Promise.reject("title not founded");}
  })
  .then((games)=>{
    res.json({games});
  })
  .catch((error)=>{
    res.status(409).json({
      message:error
    });
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
let updateGames = (req,res)=>{
  const isGame = (game)=>{
    if(!game){
      return Promise.reject("game not founded");
    }else{
      return Promise.resolve(game);
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
      message:error
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
let deleteGames = (req,res)=>{

  const isGame = (games)=>{
    if(!games){
      return Promise.reject("game not founded");
    };
  }
  
  const del = ()=>{
    Game.deleteOne({title:req.params.title},(err)=>{
      if(err){
        return Promise.reject('database failure');
      };
    });
  };

  const respond = ()=>{
    res.json({
      message:"succeed in removing a game"
    });
  };

  const onError = (error)=>{
    res.status(409).json({
      message:error
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
let findGameCompany = (req,res)=>{

  const queryStringParsing = ()=>{
    let option = null;
    let company = null;

    if(req.query.dev)
    {
      option = 0;
      company = req.query.dev;
      
      return Promise.resolve({option,company});
    }else if(req.query.pub)
    {
      option = 1;
      company = req.query.pub;

      return Promise.resolve({option,company});
    }
  };
  
  const findWithQuery = (company)=>{
    if(company.option == 0)//developer
    {
      Game.find({developer:company.company},(err)=>{
        if(err){
          return Promise.reject("database error");
        }
      })
      .then((games)=>{
        res.json({games});
      });
    }

    else if(company.option == 1)//publisher
    {
      Game.find({publisher:company.company},(err=>{
        if(err){
          return Promise.reject("database error");
        }
      }))
      .then((games)=>{
        res.json({games});
      });
    }
  };

  const onError = (error)=>{
    res.status(409).json({
      message:error
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
let findGamePrice = (req,res)=>{

  const queryStringParsing = ()=>{
    let min=0;
    let max=10000000;
    console.log(Object.keys(req.query).length);

    if(req.query.min&&req.query.max){//min <= PRICE <= max
      min = req.query.min, max = req.query.max;
      return Promise.resolve({min,max});
    }else if(!req.query.min&&req.query.max){//0 <= PRICE <= max
      max = req.query.max;
      return Promise.resolve({min,max});
    }else if(req.query.min&&!req.query.max){//min <= PRICE <= 10000000
      min = req.query.min;
      return Promise.resolve({min,max});
    }else{//0 <= PRICE <= 10000000
      return Promise.resolve({min,max});
    }
  };

  const findWithQuery = (query)=>{
    Game.find({price:{$gte:query.min,$lte:query.max}},(err)=>{
      if(err){
        return Promise.reject("database error");
      }
    })
    .then((games)=>{
      res.json({games});
    });
  };

  const onError = (error)=>{
    res.status(409).json({
      message:error
    });
  };

  Promise.resolve(queryStringParsing())
  .then(findWithQuery)
  .catch(onError);
};

exports.findGames = findGames;
exports.addGames = addGames;
exports.findGameTitle = findGameTitle;
exports.updateGames = updateGames;
exports.deleteGames = deleteGames;
exports.findGamePrice = findGamePrice;
exports.findGameCompany = findGameCompany;