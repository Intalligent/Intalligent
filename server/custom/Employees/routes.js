module.exports = function (app) {
    var Employees = require('./controller.js');

    /* Employees */
    app.get('/api/custom/Employees/find-all', restrict, Employees.EmployeesFindAll);
    app.get('/api/custom/Employees/find-one', restrict, Employees.EmployeesFindOne);
    app.post('/api/custom/Employees/create', restrict, Employees.EmployeesCreate);
    app.post('/api/custom/Employees/update', restrict, Employees.EmployeesUpdate);
    app.post('/api/custom/Employees/delete', restrict, Employees.EmployeesDelete);
    app.get('/api/custom/Employees/get-employee-profile', restrict, Employees.EmployeesGetProfile);
    app.post('/api/custom/Employees/upload', restrict, Employees.filesUpload);
    app.post('/api/custom/Employees/reset', restrict, Employees.EmployeesReset);
    app.get('/api/custom/Employees/get-field-values', restrict, Employees.EmployeesGetFieldValues);
}

