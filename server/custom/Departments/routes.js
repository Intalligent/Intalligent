module.exports = function (app) {
    var Departments = require('./controller.js');

    app.get('/api/custom/Departments/find-all', restrict, Departments.DepartmentsFindAll);
    app.get('/api/custom/Departments/find-one', restrict, Departments.DepartmentsFindOne);
    app.post('/api/custom/Departments/create', restrict, Departments.DepartmentsCreate);
    app.post('/api/custom/Departments/update/:id', restrict, Departments.DepartmentsUpdate);
    app.delete('/api/custom/Departments/delete/:id', restrict, Departments.DepartmentsDelete);
} 
