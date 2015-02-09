module.exports = function (app) {
    var AppraisalStorage = require('./controller.js');

    app.get('/api/custom/AppraisalStorage/find-all', restrict, AppraisalStorage.AppraisalStorageFindAll);
    app.get('/api/custom/AppraisalStorage/find-all-by-employee', restrict, AppraisalStorage.AppraisalStorageFindAllByEmployee);
    app.get('/api/custom/AppraisalStorage/find-one', restrict, AppraisalStorage.AppraisalStorageFindOne);
    app.get('/api/custom/AppraisalStorage/find-one-by-employee', restrict, AppraisalStorage.AppraisalStorageFindOneByEmployee);
    app.post('/api/custom/AppraisalStorage/create', restrict, AppraisalStorage.AppraisalStorageCreate);
    app.post('/api/custom/AppraisalStorage/update/:id', restrict, AppraisalStorage.AppraisalStorageUpdate);
    app.delete('/api/custom/AppraisalStorage/delete/:id', restrict, AppraisalStorage.AppraisalStorageDelete);
    app.get('/api/custom/AppraisalStorage/get-behaviour-history', restrict, AppraisalStorage.AppraisalStorageGetBehaviourHistory);
    app.get('/api/custom/AppraisalStorage/get-last-evaluation', restrict, AppraisalStorage.AppraisalStorageGetLastEvaluation);
} 
