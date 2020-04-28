var User = require('../models/users')
const Users = module.exports

Users.insert = u => {
    var newUser = new User(u)
    return newUser.save()
}
