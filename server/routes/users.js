module.exports = function (app) {
    var users = require('../controllers/users.js');

    /* USERS */
    app.post('/api/remember-password', users.rememberPassword);
    app.post('/api/change-password', users.changePassword);

    app.get('/api/users/get-user', restrict, users.usersGetUser);
    app.post('/api/users/create-user', restrict, users.usersCreateUser);
    app.post('/api/users/update-user/:id', restrict, users.usersUpdateUser);
    app.get('/api/users/get-profile', restrict, users.usersGetProfile);
    app.put('/api/users/update-profile/:id', restrict, users.usersUpdateProfile);

    app.get('/api/admin/users/find-all', restrict, users.adminUsersFindAll); //restrictRole('52932c90dc7bb5e81b000006')
    app.get('/api/admin/users/find-one', restrict, users.adminUsersFindOne);
    app.post('/api/admin/users/create', restrict, users.adminUsersCreate);
    app.put('/api/admin/users/update/:id', restrict, users.adminUsersUpdate);
    app.delete('/api/admin/users/delete/:id', restrict, users.adminUsersDelete);
    app.post('/api/admin/users/set-status', restrict, users.adminUsersSetStatus);

    app.delete('/api/logout', restrict, users.logout);
}


