var axios = require('axios');
var Users = require('../controllers/users')
var Connbd = require('../connBD/connBD')
const Utils = module.exports

function getEids(data){
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

  user._id = idUser
  user.name = res1.data['name']['credit-name']['value']
  user.biography = res1.data['biography']['content']
  user.eids = getEids(res2.data)

  //insert userInfo on DB
  await Users.insert(user)

  Connbd.closeConnection()

  return
}
