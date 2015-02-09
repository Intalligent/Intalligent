module.exports = function (app) {
    var RatingTemplates = require('./controller.js');

    /* RatingTemplates */
    app.get('/api/custom/RatingTemplates/find-all', restrict, RatingTemplates.RatingTemplatesFindAll);
    app.get('/api/custom/RatingTemplates/find-one', restrict, RatingTemplates.RatingTemplatesFindOne);
    app.post('/api/custom/RatingTemplates/create', restrict, RatingTemplates.RatingTemplatesCreate);
    app.post('/api/custom/RatingTemplates/update', restrict, RatingTemplates.RatingTemplatesUpdate);
    app.post('/api/custom/RatingTemplates/delete', restrict, RatingTemplates.RatingTemplatesDelete);
}

