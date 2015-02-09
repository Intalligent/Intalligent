module.exports = function (app) {
    var ActionCategories = require('./controller.js');

    app.get('/api/custom/ActionCategories/find-all', restrict, ActionCategories.ActionCategoriesFindAll);
    app.get('/api/custom/ActionCategories/find-one', restrict, ActionCategories.ActionCategoriesFindOne);
    app.post('/api/custom/ActionCategories/create', restrict, ActionCategories.ActionCategoriesCreate);
    app.post('/api/custom/ActionCategories/update/:id', restrict, ActionCategories.ActionCategoriesUpdate);
    app.delete('/api/custom/ActionCategories/delete/:id', restrict, ActionCategories.ActionCategoriesDelete);
} 
