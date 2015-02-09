var mongoose = require('mongoose');

var logsSchema = new mongoose.Schema({
    text: String,
    type: Number,
    user_id: String,
    ip: String,
    created: { type: Date, default: Date.now }
}, { collection: config.app.collectionsPrefix+'logs' })

// other virtual / static methods added to schema

logsSchema.statics.saveToLog = function(req, data, done){
    if (req) {
        var log = {
            text: data.text,
            type: data.type,
            user_id : (req.isAuthenticated()) ? req.user.id : null,
            ip : req.headers['x-forwarded-for'] || req.connection.remoteAddress
        };
    }
    else {
        var log = {
            text: data.text,
            type: data.type
        };
    }

    this.create(log, function(err, log){
        if(err) throw err;

        if (typeof done != 'undefined') done({result: 1, msg: "Log created", log: log.toObject()});
    });
}

// admin methods

logsSchema.statics.adminFindAll = function(req, done){
    var Log = this, perPage = config.pagination.itemsPerPage, page = (req.query.page) ? req.query.page : 1;
    var find = {}, searchText = (req.query.search) ? req.query.search : false;

    if (searchText)
        find = {$or: [{text: {$regex : searchText}}, {user_id: {$regex : searchText}} ]};

    this.find(find,{}, {skip: (page-1)*perPage, limit: perPage, sort: {created: -1}}, function(err, logs){
        if(err) throw err;

        Log.count(find, function (err, count) {
            done({result: 1, page: page, pages: Math.ceil(count/perPage), logs: logs});
        });
    });
}

//var Log = mongoose.model("Log", logsSchema);
var Logs = connection.model('Logs', logsSchema);
module.exports = Logs;