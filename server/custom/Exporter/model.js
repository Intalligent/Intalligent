var mongoose = require('mongoose');

var ExporterSchema = new mongoose.Schema({
    status: {type: Number}
}, { collection: config.app.customCollectionsPrefix+'Exporter' })


var Exporter = connection.model('Exporter', ExporterSchema);
module.exports = Exporter;