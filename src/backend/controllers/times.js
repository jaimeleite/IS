var Time = require('../models/times')
const Times = module.exports

Times.dropCollection = () => {
    return Time.deleteMany({})
}

Times.insertLastUpdate = (time) => {
    var newTime = new Time(time)
    return newTime.save()
}