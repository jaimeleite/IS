var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var Times = require('../controllers/times')
var fs = require('fs');
var axios = require('axios')
var Orcids = require('../controllers/orcids')
var Utils = require('../public/javascripts/utils')

var apikey="35aa4d6f60c2873044eb2bcfbc50cb5e"

/* GET home page. */
router.get('/', async function(req, res, next) {
  var lastUpdate = await Times.getLastUpdate()

  res.render('index', {lastUpdate: String(lastUpdate[0].time)})
});

router.get('/users', async function(req, res, next) {
  var lastUpdate = await Times.getLastUpdate()

  Users.getUsers()
    .then(result => {
      res.render('listUsers', {lista: result, lastUpdate: String(lastUpdate[0].time)})
    })
    .catch(e => res.status(500).jsonp(e))
});

router.get('/orcidReg', async function(req, res, next) {
  var lastUpdate = await Times.getLastUpdate()

  res.render('orcidReg', {message: -1, lastUpdate: String(lastUpdate[0].time)})
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

//number of pubs

router.get('/npubs/:id', (req,res)=>{
  Users.getNPubs(req.params.id)
    .then(data=>res.json(data))
    .catch(err=>res.json(err))
})

//ISSN

router.get('/issn/:code', async function(req,res,next){
  var lastUpdate = await Times.getLastUpdate()

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
        scoreTrackerYear: scoreTrackerYear ? scoreTrackerYear : '',
        lastUpdate: String(lastUpdate[0].time)
      })
    })
    .catch(e => res.render('error',{error:e}))
})

router.get('/:idUser', async function(req, res, next) {
  var lastUpdate = await Times.getLastUpdate()
  idUser = req.params.idUser
  
  Users.getUser(idUser)
    .then(async result => {
      pubs = []

      Utils.parsePubs(idUser, result.publicacoes)
        .then(async publicacoes => {
          Users.getNPubs(idUser)
            .then(nPubs =>{
              console.log(nPubs)
              res.render('userInfo', {
              id: result._id,
              name: result.name,
              biography: result.biography,
              pubs: publicacoes,
              nPubs: nPubs[0].NumberOfPubs,
              lastUpdate: String(lastUpdate[0].time)
              })
            })
        })
    })
    .catch(e => res.status(500).jsonp(e)) 
});

router.post('/insertOrcid', async function(req,res){
  var lastUpdate = await Times.getLastUpdate()

  try {
    await Orcids.insert(req.body.orcid)

    res.render('orcidReg', {message: 1, lastUpdate: String(lastUpdate[0].time)})
  }
  catch (error) {
    res.render('orcidReg', {message: 0, lastUpdate: String(lastUpdate[0].time)})
  }
})

module.exports = router;
