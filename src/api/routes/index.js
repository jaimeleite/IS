var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')

/* GET home page. */
router.get('/:idUser', async function(req, res, next) {
    idUser = req.params.idUser

    Users.getUser(idUser)
      .then(data => res.jsonp(data))
      .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
