var axios = require('axios');
var Users = require('../../controllers/users')
const Utils = module.exports


Utils.parsePubs = async (idUser, idsPubs) => {
    pubs = []

    for(let i = 0; i<idsPubs.length; i++){
        await Users.getPub(idUser, idsPubs[i])
            .then(pub => {
                pubs.push(pub.publicacoes[0])
            })
    }

    return pubs
}