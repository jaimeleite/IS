var User = require('../models/users')
const Users = module.exports

Users.insert = u => {
    var newUser = new User(u)
    return newUser.save()
}

Users.getIeds = u => {
    try {
        return User.find({_id:u}, {eids:1, _id:0})
    }
    catch (err){
        return []
    }
}
Users.getUser = u => {
    return User.find({_id:u})
}

Users.updateEIDS = (u, eids) => {
    return User.updateOne(
        { _id: u },
        { $push: { eids: { $each:eids } } }
     )
}

Users.updatePUBS = (u, pubs) => {
    return User.updateOne(
        { _id: u },
        { $push: { publicacoes: { $each:pubs } } }
     )
}

Users.getUsers = () => {
    return User.find({}, {_id:1})
}