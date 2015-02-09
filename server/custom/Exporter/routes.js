module.exports = function (app) {
    var Exporter = require('./controller.js');

    /* Exporter */
    app.get('/api/custom/Exporter/export', restrict, Exporter.ExporterExport);
}

