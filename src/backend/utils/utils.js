var axios = require('axios');
var Users = require('../controllers/users')
var Connbd = require('../connBD/connBD')
const Utils = module.exports

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

//update or insert new user information
Utils.userInfo = async (idUser) => {
  Connbd.establishConnection('is')
  user = {}
  
  const [res1, res2] = await axios.all([
    axios.get('https://pub.orcid.org/v3.0/' + idUser + '/person', { headers: {'Accept': 'application/json'}}),
    axios.get('https://pub.orcid.org/v3.0/' + idUser + '/works', { headers: {'Accept': 'application/json'}})
  ])

  publicacoes = []
  links = []
  eids = getEids(res2.data)

  for (let index = 0; index < eids.length; index++){
      await axios.get('https://api.elsevier.com/content/abstract/scopus_id/' + eids[index] + '?apiKey=35aa4d6f60c2873044eb2bcfbc50cb5e', { headers: {'Accept': 'application/json'}})
        .then(response => { 
        pub = response.data
        author = pub['abstracts-retrieval-response']['coredata']['dc:creator']['author']['ce:indexed-name']
        title = pub['abstracts-retrieval-response']['coredata']['dc:title']
        journal = pub['abstracts-retrieval-response']['coredata']['prism:publicationName']
        volume = pub['abstracts-retrieval-response']['coredata']['prism:volume']
        issn = pub['abstracts-retrieval-response']['coredata']['prism:issn']
        date = pub['abstracts-retrieval-response']['coredata']['prism:coverDate']
        doi = pub['abstracts-retrieval-response']['coredata']['prism:doi']
        cites = pub['abstracts-retrieval-response']['coredata']['citedby-count']
        type = pub['abstracts-retrieval-response']['coredata']['subtypeDescription']
        
        pubInfo = {
          author: author ? author : '',
          title: title ? title : '',
          journal: journal ? journal : '',
          volume: volume ? volume : '',
          issn: issn ? issn : '',
          date: date ? date : '',
          doi: doi ? doi : '',
          cites: cites ? cites : '',
          type: type ? type : ''
        }

        publicacoes.push(pubInfo)

        console.log("Encontrei a publicação", eids[index])
      })
      .catch(err => {
        console.log("Publicação", eids[index], "=> Erro:", err.response.statusText)
      })
  }

  console.log("Acabei de procurar as publicações")

  user._id = idUser
  user.name = res1.data['name']['credit-name']['value']
  user.biography = res1.data['biography']['content']
  user.publicacoes = publicacoes

  //insert userInfo on BD
  await Users.insert(user)

  console.log("Utilizador inserido na base de dados")

  Connbd.closeConnection()

  return
}
