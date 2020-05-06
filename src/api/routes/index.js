var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var fs = require('fs');
var axios = require('axios')

var apikey="35aa4d6f60c2873044eb2bcfbc50cb5e"

/* GET home page. */
router.get('/', async function(req, res, next) {
  Users.getUsers()
    .then(result => res.render('index', {lista: result}))
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

router.get('/back2.jpg', function(req, res, next) {
  fs.readFile('public/images/back2.jpg', (err,img)=>{
    if (err)
      console.log("erro->"+err)
    res.set('Content-Type','image/png')
    res.end(img);
  })
});

//ISSN

router.get('/issn/:code', function(req,res,next){
  console.log("https://api.elsevier.com/content/serial/title/issn/"+ req.params.code+"?apiKey="+apikey)
  axios.get("https://api.elsevier.com/content/serial/title/issn/"+ req.params.code+"?apiKey="+apikey)
    .then(dados => res.jsonp(dados.data))
    //.then(dados => res.render('issn',{issn:dados.data}))
    .catch(e => res.jsonp(e))
})

router.get('/:idUser', async function(req, res, next) {
  idUser = req.params.idUser
  
  if (req.query.idPub) {
    Users.getPub(idUser, req.query.idPub)
      .then(result => res.render('pubInfo', {idUser: idUser, pub: result.publicacoes[0]}))
      .catch(e => res.status(500).jsonp(e))
  }
  
  else {
    Users.getUser(idUser)
      .then(result => res.render('userInfo', {user: result}))
      .catch(e => res.status(500).jsonp(e)) 
  }
});



module.exports = router;
