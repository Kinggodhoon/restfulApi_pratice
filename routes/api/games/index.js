const router = require('express').Router();
const controller = require('./controller');

//GET
router.get('/',controller.findGames);
router.get('/company',controller.findGameCompany);
router.get('/price',controller.findGamePrice);
router.get('/:title',controller.findGameTitle);

//POST
router.post('/',controller.addGames);

//PUT
router.put('/:title',controller.updateGames);

//DELETE
router.delete('/:title',controller.deleteGames);

module.exports = router;