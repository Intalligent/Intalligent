//var Users = require('../models/users');
var Users = connection.model('Users');

/* USERS */

exports.adminUsersFindAll = function(req,res){
    Users.adminFindAll(req, function(result){
        res.send(201, result);
    });
};

exports.adminUsersFindOne = function(req,res){
    Users.adminFindOne(req, function(result){
        res.send(201, result);
    });
};

exports.adminUsersCreate = function(req,res){
    Users.adminCreate(req, function(result){
        res.send(201, result);
    });
};

exports.adminUsersUpdate = function(req,res){
    Users.adminEdit(req, function(result){
        res.send(201, result);
    });
};

exports.adminUsersDelete = function(req,res){
    Users.adminDelete(req, function(result){
        res.send(201, result);
    });
};

exports.adminUsersSetStatus = function(req,res){
    Users.adminSetStatus(req, function(result){
        res.send(201, result);
    });
};

exports.rememberPassword = function(req,res){
    var body = req.body;

    Users.findOne({ email: body.email }, function (err, findUser) {
        if(findUser){
            Users.rememberPassword(body.email, function(result){
                res.send(201, result);
            });
        }else{
            res.send(201, {result: 0, msg: 'Email not registered'});
        }
    });

};

exports.changePassword = function(req,res){
    var body = req.body;

    Users.findOne({ hash_change_password: body.hash }, function (err, findUser) {
        if(findUser){
            Users.changePassword(req, function(result){
                res.send(201, result);
            });
        }else{
            res.send(201, {result: 0, msg: 'Invalid hash'});
        }
    });

};

exports.usersGetUser = function(req,res){
    console.log(req.query);
    Users.getUserByUsername(req.query.username, function(result){
        res.send(201, result);
    });
};

exports.usersCreateUser = function(req,res){
    Users.createUser(req, function(result){
        res.send(201, result);
    });
};

exports.usersUpdateUser = function(req,res){
    Users.editUser(req.body.id, req.body, function(result){
        res.send(201, result);
    });
};

exports.usersGetProfile = function(req,res){
    Users.getProfile(req.user.id, function(result){
        res.send(201, result);
    });
};

exports.usersUpdateProfile = function(req,res){
    Users.editProfile(req.user.id, req.query, function(result){
        res.send(201, result);
    });
};

exports.logout = function(req,res){
    req.session.loggedIn = false;
    req.session= null;
    res.end()
};