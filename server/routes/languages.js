module.exports = function (app) {
    var languages = require('../controllers/languages.js');

    /* TRANSLATIONS */
    app.get('/api/get-translations', restrict, languages.languagesGetTranslations);

    app.get('/api/admin/languages/find-all', restrict, languages.adminLanguagesFindAll);
    app.get('/api/admin/languages/find-one', restrict, languages.adminLanguagesFindOne);
    app.post('/api/admin/languages/save-translations', restrict, languages.adminLanguagesSaveTranslations);
}


