module.exports = function (app) {
    var ProfessionalGroups = require('./controller.js');

    app.get('/api/custom/ProfessionalGroups/find-all', restrict, ProfessionalGroups.ProfessionalGroupsFindAll);
    app.get('/api/custom/ProfessionalGroups/find-one', restrict, ProfessionalGroups.ProfessionalGroupsFindOne);
    app.post('/api/custom/ProfessionalGroups/create', restrict, ProfessionalGroups.ProfessionalGroupsCreate);
    app.post('/api/custom/ProfessionalGroups/update/:id', restrict, ProfessionalGroups.ProfessionalGroupsUpdate);
    app.delete('/api/custom/ProfessionalGroups/delete/:id', restrict, ProfessionalGroups.ProfessionalGroupsDelete);
} 
