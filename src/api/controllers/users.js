var User = require('../models/users')
const Users = module.exports

Users.getUsers = () => {
    return User
        .find({},{id:1,name:1})
        .exec()
}

Users.getUser = (idUser) => {
    return User
        .findOne({_id: idUser})
        .exec()
}

Users.getPub = (idUser, idPub) => {
    return User
        .findOne({_id: idUser}, {publicacoes: { $elemMatch: {_id: idPub}}})
        .exec()
}
//db.users.aggregate({$project:{NumberOfPubs:{$size:"$publicacoes"}}})
Users.getNPubs = (idUser) => {
    return User
        .aggregate([
            {$project:{NumberOfPubs:{$size:"$publicacoes"}}},
            { $match : { _id : idUser } }
        ])
        .exec()
}