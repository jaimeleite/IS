var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    let results = await axios.get('https://pub.orcid.org/v3.0/0000-0003-4121-6169/works', { headers: {'Accept': 'application/json'}})
    dados = results.data
    my_list = []
    dados['group'].forEach(r => {
      r['work-summary'].forEach(r2 => {
        try{
          my_list.push(r2['url']['value'])
        }
        catch{
          my_list.push('None')
        }
      })
    })

    my_list2 = []
    my_list.forEach(r => {
      if(r.indexOf('eid=') > 0){
        k1 = r.indexOf('eid=')
        k2 = r.indexOf('&',k1)
        if(!my_list2.includes(r.substring(k1+11, k2))){
          my_list2.push(r.substring(k1+11, k2))
        }
      }
    })

    console.log("EID's:", my_list2)
});

module.exports = router;
