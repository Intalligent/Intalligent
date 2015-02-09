module.exports = function (app) {
    var roles = require('../controllers/roles.js');

    /* ROLES */
    app.get('/api/admin/roles/find-all', restrict, roles.adminRolesFindAll);
    app.get('/api/admin/roles/find-one', restrict, roles.adminRolesFindOne);
}


