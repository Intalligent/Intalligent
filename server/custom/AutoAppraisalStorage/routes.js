module.exports = function (app) {
    var AutoAppraisalStorage = require('./controller.js');

    app.get('/api/custom/AutoAppraisalStorage/find-all', restrict, AutoAppraisalStorage.AutoAppraisalStorageFindAll);
    app.get('/api/custom/AutoAppraisalStorage/find-all-by-employee', restrict, AutoAppraisalStorage.AutoAppraisalStorageFindAllByEmployee);
    app.get('/api/custom/AutoAppraisalStorage/find-one', restrict, AutoAppraisalStorage.AutoAppraisalStorageFindOne);
    app.get('/api/custom/AutoAppraisalStorage/find-one-by-employee', restrict, AutoAppraisalStorage.AutoAppraisalStorageFindOneByEmployee);
    app.post('/api/custom/AutoAppraisalStorage/create', restrict, AutoAppraisalStorage.AutoAppraisalStorageCreate);
    app.post('/api/custom/AutoAppraisalStorage/update/:id', restrict, AutoAppraisalStorage.AutoAppraisalStorageUpdate);
    app.delete('/api/custom/AutoAppraisalStorage/delete/:id', restrict, AutoAppraisalStorage.AutoAppraisalStorageDelete);
    app.get('/api/custom/AutoAppraisalStorage/get-behaviour-history', restrict, AutoAppraisalStorage.AutoAppraisalStorageGetBehaviourHistory);
    app.get('/api/custom/AutoAppraisalStorage/get-last-evaluation', restrict, AutoAppraisalStorage.AutoAppraisalStorageGetLastAutoEvaluation);
} 
