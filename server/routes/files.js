module.exports = function (app) {
    var files = require('../controllers/files.js');

    /* FILES */
    app.get('/api/files/get-files', restrict, files.filesGetFiles);
    app.post('/api/files/upload', restrict, files.filesUpload);

    app.get('/api/admin/files/find-all', restrict, files.adminFilesFindAll);
    app.get('/api/admin/files/find-one', restrict, files.adminFilesFindOne);
    app.post('/api/admin/files/upload', restrict, files.adminFilesUpload);
    app.put('/api/admin/files/update/:id', restrict, files.adminFilesUpdate);
    app.delete('/api/admin/files/delete/:id', restrict, files.adminFilesDelete);
}


