module.exports = function (app) {
    var Loader = require('./controller.js');

    /* Loader */
    app.post('/api/custom/Loader/upload', restrict, Loader.LoaderUpload);
    app.post('/api/custom/Loader/import/:id', restrict, Loader.LoaderImport);
}

