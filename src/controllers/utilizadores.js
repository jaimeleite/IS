var Utilizador = require('../models/utilizadores')

module.exports.inserir = u => {
    var novo = new Utilizador(u)
    return novo.save()
}
