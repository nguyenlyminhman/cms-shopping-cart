const config = require('config');

module.exports = {

    db: function db() {
        let host = config.get('db.host');
        let port = config.get('db.port');
        let name = config.get('db.name');
        return "mongodb://"+host+":"+port+"/"+name
    }
}