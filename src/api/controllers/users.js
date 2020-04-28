var User = require('../models/users')
const Users = module.exports

Users.getUser = userId => {
    return User
        .findOne({_id: userId})
        .exec()
}
