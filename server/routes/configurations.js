module.exports = function (app) {
    var configurations = require('../controllers/configurations.js');

    /* CONFIGURATIONS */
    app.get('/api/admin/configurations/find-user-filters', restrict, configurations.adminFindUserFilters);
    app.get('/api/admin/configurations/get-configurations', restrict, configurations.adminGetConfigurations);
    app.post('/api/admin/configurations/save-configurations', restrict, configurations.adminSaveConfigurations);
}


