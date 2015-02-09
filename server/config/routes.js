module.exports = function (app, passport) {
    var server = require('../index.js');
    var api = require('../api.js');
    var installer = require('../install.js');

    // Routes
    app.get('/', server.login);
    app.get('/login', function(req, res, next) {
        res.writeHead(301,
            {Location: '/'}
        );
        res.end();
    });

    app.get('/install', server.install);
    app.post('/install', installer.install);

    app.get('/public', server.index);
    app.get('/home', restrict,server.webapp);
    app.get('/partial/:name', server.partial);
    app.get('/partial/:controller/:name', server.controllerPartial);
    app.get('/partial/custom/:controller/:name', server.controllerCustomPartial);
    app.get('/view/admin/:controller/:name', server.adminview);

    // JSON API
    app.get('/api/init-data', api.getInitData);

    /* PASSPORT */
    app.post('/api/login', function(req, res, next) {
        if (req.query.s && req.query.s == 'change-user') {
            var data = req.body, restrictRole = true;
            var roles = ['52988ac5df1fcbc201000008', '5327d7ef9c3b0f7801acda0d'];
            var userRoles = (typeof req.user.roles == 'string') ? [req.user.roles] : req.user.roles;

            for (var i in roles) {
                if (userRoles.indexOf(roles[i]) > -1){
                    restrictRole = false;
                    break;
                }
            }

            if (!restrictRole) {
                var Users = connection.model('Users');

                Users.findOne({username: data.username}, function(err, user){
                    if (user) {
                        req.body.password = user.hash+user.salt;

                        passport.authenticate('local', function(err, user, info) {
                            console.log(info);
                            if (err) { return next(err); }

                            req.logIn(user, function(err) {
                                if (err) { return next(err); }
                                res.json({ user : user.toObject() });
                            });
                        })(req, res, next);
                    }
                    else {
                        res.send(201, {result: 0, msg: 'User not found.'});
                    }
                });
            }
            else {
                res.send(201, {result: 0, msg: 'Invalid user role.'});
            }
        }
        else {
            passport.authenticate('local', function(err, user, info) {
                console.log(info);
                if (err) { return next(err); }

                var Configurations = connection.model('Configurations');

                if (!user) {
                    Configurations.getConfiguration('log-user-fail-login', function(configuration){
                        if (configuration.value == 1) {
                            saveToLog(req, 'User fail login: '+info.message, 102);
                        }
                        res.send(401, info.message);
                        return;
                    });
                }
                else {
                    Configurations.getConfiguration('log-user-login', function(configuration){
                        if (configuration.value == 1) {
                            saveToLog(req, 'User login: '+user.username+' ('+user.email+')', 102);
                        }
                        req.logIn(user, function(err) {
                            if (err) { return next(err); }
                            res.json({ user : user.toObject() });
                        });
                    });
                }
            })(req, res, next);
        }
    });
}
