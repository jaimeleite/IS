var Utils = require('./utils/utils')
var Users = require('./controllers/users')
var Orcids = require('./controllers/orcids')
var Connbd = require('./connBD/connBD')

getUsersId = async() => { 
    Connbd.establishConnection('is')

    try {
        Orcids.insert('0000-0001-6457-0756')
        Orcids.insert('0000-0003-4121-6169')
        Orcids.insert('0000-0001-9710-847X')
    }
    catch (error) {
        console.log(error)
    }

    var users = await Orcids.getORCIDS()
    
    for(let i = 0; i<users.length; i++)
    {
        
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
