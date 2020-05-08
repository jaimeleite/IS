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
    .then(dados => {
      info = dados.data['serial-metadata-response']['entry'][0]
      
      title = info['dc:title']
      publisher = info['dc:publisher']
      covStartYear = info['coverageStartYear']
      covEndYear = info['coverageEndYear']
      sourceId = info['source-id']
      //--several fiels in sjr--//
      sjr = info['SJRList']['SJR'][0]
      sjrYear = sjr['@year']
      sjrPercent = sjr['$']
      //--several fiels in citescore--//
      citesScore = info['citeScoreYearInfoList']
      currentMetric = citesScore['citeScoreCurrentMetric']
      currentMetricYear = citesScore['citeScoreCurrentMetricYear']
      scoreTracker = citesScore['citeScoreTracker']
      scoreTrackerYear = citesScore['citeScoreTrackerYear']

      res.render('issnInfo', {
        title: title ? title : '',
        publisher: publisher ? publisher : '',
        covStartYear: covStartYear ? covStartYear : '',
        covEndYear: covEndYear ? covEndYear : '',
        sourceId: sourceId ? sourceId : '',
        sjrYear: sjrYear ? sjrYear : '',
        sjrPercent: sjrPercent ? sjrPercent : '',
        currentMetric: currentMetric ? currentMetric : '',
        currentMetricYear: currentMetricYear ? currentMetricYear : '',
        scoreTracker: scoreTracker ? scoreTracker : '',
        scoreTrackerYear: scoreTrackerYear ? scoreTrackerYear : ''
      })
    })
    //.then(dados => {res.render('issn',{issn:dados.data.serial-metadata-response})})
    .catch(e => res.jsonp(e))
})

router.get('/:idUser', async function(req, res, next) {
  idUser = req.params.idUser
  
  if (req.query.idPub) {
    Users.getPub(idUser, req.query.idPub)
    .then(result => {
      pub = result.publicacoes[0]
      res.render('pubInfo', {
                  idUser: idUser,
                  title: pub.title,
                  journal: pub.journal,
                  volume: pub.volume,
                  issn: pub.issn,
                  date: pub.date,
                  doi: pub.doi,
                  cites: pub.cites,
                  type: pub.type,
                  authors: pub.authors,
                })})
      .catch(e => res.status(500).jsonp(e))
  }
  
  else {
    Users.getUser(idUser)
      .then(result => {
        res.render('userInfo', {
                    id: result._id,
                    name: result._name,
                    biography: result.biography,
                    pubs: result.publicacoes
                  })
      })
      .catch(e => res.status(500).jsonp(e)) 
  }
});



module.exports = router;
