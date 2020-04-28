var mongoose = require('mongoose')
const Connbd = module.exports

Connbd.establishConnection = (dbname) => {
    mongoose.connect('mongodb://localhost/' + dbname, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> console.log('Mongo ready: ' + mongoose.connection.readyState))
        .catch((erro)=> console.log('Mongo: erro na conexão: ' + erro))
}

Connbd.closeConnection = () => {
    mongoose.connection.close()
}
