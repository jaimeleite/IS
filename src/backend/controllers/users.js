var User = require('../models/users')
const Users = module.exports

Users.insert = u => {
    var newUser = new User(u)
    return newUser.save()
}

Users.getIeds = u => {
    try {
        return User.find({_id:u}, {eids:1}).exec()
    }
    catch (err){
        return []
    }
}