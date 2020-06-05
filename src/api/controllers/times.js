var Time = require('../models/times')
const Times = module.exports

Times.dropCollection = () => {
    return Time.deleteMany({})
}

Times.insertLastUpdate = (time) => {
    //return Time.insert({'time': time})
    var newTime = new Time(time)
    return newTime.save()
}

Times.getLastUpdate = () => {
    return Time.find()
}