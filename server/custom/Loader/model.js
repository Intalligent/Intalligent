var mongoose = require('mongoose');

var LoaderSchema = new mongoose.Schema({
    status: {type: Number}, // 1-Loaded, 2-Started, 3-Completed
    userID: {type: String},
    fileURL: {type: String, required: true},
    fileName: {type: String},
    fileSize: {type: String},
    fileFields: {type: Array},
    fileData: {type: Array},
    loadLog: {type: String}
}, { collection: config.app.customCollectionsPrefix+'Loader' })


/*LoaderSchema.statics. = function(data){
    data.nd_trash_deleted = false;

    this.create(data, function(err){
        if(err) throw err;
    });
}*/

var Loader = connection.model('Loader', LoaderSchema);
module.exports = Loader;