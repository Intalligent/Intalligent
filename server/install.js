exports.install = function(req, res){
    var data = req.body;
    var hash = require('../util/hash');

    var Users = connection.model('Users');

    installRoles(function() {
        hash(data.password, function(err, salt, hash){
            if(err) throw err;

            Users.create({
                status : 1,
                username: data.username,
                email : data.email,
                language : 'en',
                salt : salt,
                hash : hash,
                roles: ['52988ac5df1fcbc201000008']
            }, function(err, user){
                if(err) throw err;

                res.writeHead(301,
                    {Location: config.url}
                );
                res.end();
            });
        });
    });
};

function installRoles(done) {
    var Roles = connection.model('Roles');

    var mongoose = require('mongoose');

    Roles.create({
        _id: mongoose.Types.ObjectId('52988ac5df1fcbc201000008'),
        name: 'Admin'
    }, function(err){
        if(err) throw err;

        Roles.create({
            _id: mongoose.Types.ObjectId('5327d7ef9c3b0f7801acda0d'),
            name: 'HHRR Admin'
        }, function(err){
            if(err) throw err;

            Roles.create({
                _id: mongoose.Types.ObjectId('52988ad4df1fcbc201000009'),
                name: 'Employee'
            }, function(err){
                if(err) throw err;

                done();
            });
        });
    });
}