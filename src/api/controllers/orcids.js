var Orcid = require('../models/orcids')
const Orcids = module.exports

Orcids.insert = orcid => {
    var id = {}
    
    id._id = orcid
    
    var newOrcid = new Orcid(id)
    
    return newOrcid.save()
}

Orcids.getORCIDS = () => {
    return Orcid.find({}, {_id:1})
}