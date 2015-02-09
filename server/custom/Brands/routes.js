module.exports = function (app) {
    var Brands = require('./controller.js');

    app.get('/api/custom/Brands/find-all', restrict, Brands.BrandsFindAll);
    app.get('/api/custom/Brands/find-one', restrict, Brands.BrandsFindOne);
    app.post('/api/custom/Brands/create', restrict, Brands.BrandsCreate);
    app.post('/api/custom/Brands/update/:id', restrict, Brands.BrandsUpdate);
    app.delete('/api/custom/Brands/delete/:id', restrict, Brands.BrandsDelete);
} 
