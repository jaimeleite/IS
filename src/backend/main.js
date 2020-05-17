var Utils = require('./utils/utils')
var Users = require('./controllers/users')
var Connbd = require('./connBD/connBD')

getUsersId = async() => { 
    Connbd.establishConnection('is')

    var users = await Users.getUsers()
    
    for(let i = 0; i<users.length; i++){
        await Utils.userInfo(users[i]._id)
    }
  
    Connbd.closeConnection()
}

getUsersId()

//José Machado
//Utils.userInfo('0000-0003-4121-6169')

//Marisa Esteves
//Utils.userInfo('0000-0001-9710-847X')

//Antonio Abelha 
//Utils.userInfo('0000-0001-6457-0756')
