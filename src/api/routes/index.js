var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var fs = require('fs');

/* GET home page. */
router.get('/', async function(req, res, next) {
    idUser = req.params.idUser

    Users.getUser()
      .then(dados => res.render('index', {lista: dados}))
      .catch(e => res.status(500).jsonp(e))
});

router.get('/img_avatar.png', function(req, res, next) {
  fs.readFile('public/images/img_avatar.png', (err,img)=>{
    if (err)
      console.log("erro->"+err)
    res.set('Content-Type','image/png')
    res.end(img);
  })
});

module.exports = router;
