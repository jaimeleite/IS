var axios = require('axios');
var Users = require('../controllers/users')
var Connbd = require('../connBD/connBD')
const Utils = module.exports
//const axiosTiming = require('axios-timing')
 
//axiosTiming(axios, console.log)

var pubsTime = []
var authorsTime = []

getEids = (data) => {
  //save urls for each work
  urls = []
  data['group'].forEach(r => {
    r['work-summary'].forEach(r2 => {
      try { urls.push(r2['url']['value']) }
      catch { urls.push('None') }
    })
  })
  
  //save eid for each work
  eids = []
  urls.forEach(r => {
    if(r.indexOf('eid=') > 0){
      k1 = r.indexOf('eid=')
      k2 = r.indexOf('&',k1)
      if(!eids.includes(r.substring(k1+11, k2))) eids.push(r.substring(k1+11, k2))
    }
  })

  return eids
}

getAuthors = async (eid) => {
  var before = new Date();
  const authors = await axios.get('http://api.elsevier.com/content/abstract/scopus_id/' + eid + '?apiKey=35aa4d6f60c2873044eb2bcfbc50cb5e&field=authors')
    .then(response => {
      var after = new Date();

      console.log("Tempo de ir buscar os autores:", after.getTime() - before.getTime(), "milisegundos")

      authorsTime.push(after.getTime() - before.getTime())

      auts = []
      aut = response.data['abstracts-retrieval-response']['authors']['author']
      aut.forEach(author => {
        indexed_name = author['ce:indexed-name']
        if(indexed_name){
          auts.push(indexed_name)
        }
      })
      return auts
    })
    .catch(err => {
      console.log("Erro ao encontrar os autores da publicação", eid, "=> Erro:", err.response)
      return []
    })

    return authors
}

formPubs = async (eids) => {
  publicacoes = []
  for (let index = 0; index < eids.length; index++){
    pubInfo = {}
    
    //console.log(Antes:)
    
    var before = new Date();

    await axios.get('https://api.elsevier.com/content/abstract/scopus_id/' + eids[index] + '?apiKey=35aa4d6f60c2873044eb2bcfbc50cb5e', { headers: {'Accept': 'application/json'}})
      .then(response => { 
        var after = new Date();

        console.log("Tempo de ir buscar uma publicação:", after.getTime() - before.getTime(), "milisegundos")

        pubsTime.push(after.getTime() - before.getTime())

        pub = response.data
        title = pub['abstracts-retrieval-response']['coredata']['dc:title']
        journal = pub['abstracts-retrieval-response']['coredata']['prism:publicationName']
        volume = pub['abstracts-retrieval-response']['coredata']['prism:volume']
        issn = pub['abstracts-retrieval-response']['coredata']['prism:issn']
        date = pub['abstracts-retrieval-response']['coredata']['prism:coverDate']
        doi = pub['abstracts-retrieval-response']['coredata']['prism:doi']
        cites = pub['abstracts-retrieval-response']['coredata']['citedby-count']
        type = pub['abstracts-retrieval-response']['coredata']['subtypeDescription']
        
        pubInfo = {
          _id: eids[index],
          title: title ? title : '',
          journal: journal ? journal : '',
          volume: volume ? volume : '',
          issn: issn ? issn : '',
          date: date ? date : '',
          doi: doi ? doi : '',
          cites: cites ? cites : '',
          type: type ? type : ''
        }

        console.log("Encontrei a publicação", eids[index])
    })
    .catch(err => {
      console.log("Publicação", eids[index], "=> Erro:", err.response.statusText)
    })

    //get authors 
    if(Object.keys(pubInfo).length > 0){
      pubInfo.authors = await getAuthors(eids[index])
      publicacoes.push(pubInfo)
    }
  }

  return publicacoes
}

//update or insert new user information
Utils.userInfo = async (idUser) => {
  //Connbd.establishConnection('is')
  var user = {}
  
  var exists = ((await Users.getUser(idUser)).length > 0) ? 1 : 0

  // Para caso de Update /person nao precis ser feito WIP
  const [res1, res2] = await axios.all([
    axios.get('https://pub.orcid.org/v3.0/' + idUser + '/person', { headers: {'Accept': 'application/json'}}),
    axios.get('https://pub.orcid.org/v3.0/' + idUser + '/works', { headers: {'Accept': 'application/json'}})
  ])

  var db_eids = await Users.getIeds(idUser)
  db_eids = (db_eids.length) > 0 ? db_eids[0].eids : []
 
  var curr_eids = await getEids(res2.data)
  
  var eids = []
  
  if (db_eids.length === 0) {
    eids = curr_eids
  }
  else {
    eids = curr_eids.filter(x => !db_eids.includes(x))
  }

  publicacoes = await formPubs(eids)
  links = []

  console.log("Acabei de procurar as publicações")

  if (exists === 0) {
    credit_name = res1.data['name']['credit-name']
    name = credit_name ? credit_name['value'] : ''
    biography_content = res1.data['biography']
    biography = biography_content ? biography_content['content'] : ''
  
    user._id = idUser
    user.name = name ? name : ''
    user.biography = biography ? biography : ''
    
    user.eids = eids
    user.publicacoes = publicacoes

    //insert userInfo on BD
    await Users.insert(user)
    console.log("Utilizador inserido na base de dados")
  }
  else {
    user._id = idUser
    await Users.updateEIDS(user, eids)
    await Users.updatePUBS(user, publicacoes)
    console.log("Utilizador atualizado na base de dados")
  }

  console.log("Tempo médio de buscar uma publicação:", (pubsTime.reduce((a,b) => a + b, 0)) / pubsTime.length)
  console.log("Tempo médio de buscar os autores de uma publicação:", (authorsTime.reduce((a,b) => a + b, 0)) / authorsTime.length)

  //Connbd.closeConnection()

  return
}
