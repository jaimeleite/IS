var User = require('../models/users')
const Users = module.exports

Users.getUser = () => {
    return User
        .find({},{id:1,name:1})
        .exec()
}
