var express = require('express');
var axios = require('axios');
var router = express.Router();
var Utilizadores = require('../controllers/utilizadores')

/* GET home page. */
//0000-0003-4121-6169
router.get('/:idUtilizador', async function(req, res, next) {
    idUtilizador = req.params.idUtilizador

    //obter os works do utilizador
    let results = await axios.get('https://pub.orcid.org/v3.0/' + idUtilizador + '/works', { headers: {'Accept': 'application/json'}})
    dados = results.data

    //guardar os urls de cada work
    urls = []
    dados['group'].forEach(r => {
      r['work-summary'].forEach(r2 => {
        try { urls.push(r2['url']['value']) }
        catch { urls.push('None') }
      })
    })

    //guardar o eid de cada work
    eids = []
    urls.forEach(r => {
      if(r.indexOf('eid=') > 0){
        k1 = r.indexOf('eid=')
        k2 = r.indexOf('&',k1)
        if(!eids.includes(r.substring(k1+11, k2))) eids.push(r.substring(k1+11, k2))
      }
    })

    //agrupar informação do utilizador
    var utilizador = {
      orid: idUtilizador,
      eids: eids
    }
    
    //inserir utilizador na BD
    Utilizadores.inserir(utilizador)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
