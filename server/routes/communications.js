module.exports = function (app) {
    var communications = require('../controllers/communications.js');

    /* COMMUNICATIONS */
    app.get('/api/admin/communications/find-all', restrict, communications.adminCommunicationsFindAll);
    app.get('/api/admin/communications/find-one', restrict, communications.adminCommunicationsFindOne);
}


