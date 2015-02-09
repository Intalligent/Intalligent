module.exports = function (app) {
    var logs = require('../controllers/logs.js');

    /* LOGS */
    app.post('/api/save-to-log', restrict, logs.logsSaveToLog);

    app.get('/api/admin/logs/find-all', restrict, logs.adminLogsFindAll);
}


