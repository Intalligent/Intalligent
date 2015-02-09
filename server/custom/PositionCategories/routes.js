module.exports = function (app) {
    var PositionCategories = require('./controller.js');

    app.get('/api/custom/PositionCategories/find-all', restrict, PositionCategories.PositionCategoriesFindAll);
    app.get('/api/custom/PositionCategories/find-one', restrict, PositionCategories.PositionCategoriesFindOne);
    app.post('/api/custom/PositionCategories/create', restrict, PositionCategories.PositionCategoriesCreate);
    app.post('/api/custom/PositionCategories/update/:id', restrict, PositionCategories.PositionCategoriesUpdate);
    app.delete('/api/custom/PositionCategories/delete/:id', restrict, PositionCategories.PositionCategoriesDelete);
} 
