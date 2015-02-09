var mongoose = require('mongoose');
var hash = require('../../util/hash');

var usersSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    status: Number,
    email: String,
    language: String,
    salt: String,
    hash: String,
    hash_verify_account: String,
    hash_change_password: String,
    roles: [],
    filters: [],
    startDate: {type: Date, default: Date.now },
    endDate: {type: Date},
    history: String,
}, { collection: config.app.collectionsPrefix+'users' })

if (!usersSchema.options.toObject) usersSchema.options.toObject = {};
usersSchema.options.toObject.transform = function (doc, user, options) {
    user['id'] = user._id;
    delete user.salt;
    delete user.hash;
    delete user.hash_verify_account;
    delete user.hash_change_password;
}

// other virtual / static methods added to schema

usersSchema.statics.rememberPassword = function(email, done){
    var crypto = require('crypto');
    var hash_change_password = crypto.createHash('md5').update(email).digest('hex');

    var postData = {
        id: "52d66ea2c6b91ae01f00000a",
        email: email,
        tags: '{"CHANGEPWDURL": "'+config.url+'login/#/change-password/'+hash_change_password+'"}'
    };

    this.update({
        "email" : email
    }, {
        $set: {
            "hash_change_password" : hash_change_password
        }
    }, function (err) {
        if(err) throw err;

        sendCommunication(postData);

        done({result: 1, msg: "Check your email for instructions"});
    });
}

usersSchema.statics.changePassword = function(req, done){
    var User = this, data = req.body;
    if (!data.hash || !data.password) {
        done({result: 0, msg: "'hash' and 'password' is required."});
        return;
    }
    this.findOne({"hash_change_password" : data.hash},{},function(err, user){
        if(err) throw err;
        if (user) {
            hash(data.password, function(err, salt, hash){
                if(err) throw err;

                User.update({
                    "_id" : user._id
                }, {
                    $set: {
                        "salt" : salt,
                        "hash" : hash,
                        "hash_change_password" : null
                    }
                }, function (err) {
                    if(err) throw err;

                    var Configurations = connection.model('Configurations');

                    Configurations.getConfiguration('log-user-pwd-change', function(configuration){
                        if (configuration.value == 1) {
                            saveToLog(req, 'User password changed: '+user.email, 103);
                        }
                        done({result: 1, msg: "Password updated"});
                    });
                });
            });
        }
        else {
            done({result: 0, msg: "Invalid hash."});
        }
    });
}

usersSchema.statics.getUserByUsername = function(username, done){
    if (!username) {
        done({result: 0, msg: "'username' is required."});
        return;
    }
    this.findOne({"username" : username},{},function(err, user){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!user) {
            done({result: 0, msg: "User not found."});
        }
        else {
            var Configurations = connection.model('Configurations');

            Configurations.findOne({"name": 'user-filters'},{},function(err, userFilters){
                if(err) throw err;
                if (!userFilters) userFilters = [];
                else userFilters = String(userFilters.value).split(',');

                done({result: 1, user: user.toObject(), filters: userFilters});
            });
        }
    });
}

usersSchema.statics.createUser = function(req, done){
    var User = this, data = req.body;
    if (!data.username) {
        done({result: 0, msg: "'username' is required."});
        return;
    }
    this.findOne({"username" : data.username },{},function(err, user){
        if(err) throw err;
        if (user) {
            done({result: 0, msg: "Username already in use."});
        }
        else {
            var userData = {"status": 1, "username": data.username};

            if (data.email) userData['email'] = data.email;

            userData['roles'] = ['52988ad4df1fcbc201000009'];

            User.create(userData, function(err, user){
                if(err) throw err;

                done({result: 1, msg: "User created.", user: user});
            });
        }
    });
}

usersSchema.statics.editUser = function(id, data, done){
    var User = this;
    if (!id || !data.username) {
        done({result: 0, msg: "'id' and 'username' is required."});
        return;
    }
    this.findOne({"username" : data.username, "_id": { $ne: id } },{},function(err, user){
        if(err) throw err;
        if (user) {
            done({result: 0, msg: "Username already in use."});
        }
        else {
            var userData = {"username" : data.username};

            if (data.filters) {
                userData['filters'] = data.filters;

                var Configurations = connection.model('Configurations');
                Configurations.adminAddFilters(data.filters);
            }

            if (data.password) {
                hash(data.password, function(err, salt, hash){
                    if(err) throw err;

                    userData['salt'] = salt;
                    userData['hash'] = hash;

                    User.update({
                        "_id" : id
                    }, {
                        $set: userData
                    }, function (err) {
                        if(err) throw err;

                        done({result: 1, msg: "User updated."});
                    });
                });
            }
            else {
                User.update({
                    "_id" : id
                }, {
                    $set: userData
                }, function (err) {
                    if(err) throw err;

                    done({result: 1, msg: "User updated."});
                });
            }
        }
    });
}

usersSchema.statics.getProfile = function(id, done){
    if (!id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.findOne({"_id" : id},{},function(err, user){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!user) {
            done({result: 0, msg: "User not found."});
        }
        else {
            var Roles = connection.model('Roles'); //require('../models/roles');

            Roles.find({"_id": {$in: user.roles}},{}, function(err, roles){
                if(err) throw err;

                user.roles = roles;

                done({result: 1, profile: user.toObject()});
            });
        }
    });
}

usersSchema.statics.editProfile = function(id, data, done){
    var User = this;
    if (!id || !data.username || !data.language) {
        done({result: 0, msg: "'id', 'username' and 'language' is required."});
        return;
    }
    this.findOne({"username" : data.username, "_id": { $ne: id } },{},function(err, user){
        if(err) throw err;
        if (user) {
            done({result: 0, msg: "Username already in use."});
        }
        else {
            if (data.password) {
                hash(data.password, function(err, salt, hash){
                    if(err) throw err;

                    User.update({
                        "_id" : id
                    }, {
                        $set: {
                            "username" : data.username,
                            "language" : data.language,
                            "salt" : salt,
                            "hash" : hash
                        }
                    }, function (err) {
                        if(err) throw err;

                        done({result: 1, msg: "Profile updated."});
                    });
                });
            }
            else {
                User.update({
                    "_id" : id
                }, {
                    $set: {
                        "username" : data.username,
                        "language" : data.language
                    }
                }, function (err) {
                    if(err) throw err;

                    done({result: 1, msg: "Profile updated."});
                });
            }
        }
    });
}

usersSchema.statics.isValidUserPassword = function(username, password, done) {
    this.findOne({$or:[ {'username': username}, {'email': username} ]}, function(err, user){
        // if(err) throw err;
        if(err) return done(err);
        if(!user) return done(null, false, { message : 'Incorrect user '+username });
        if(user.status == 0) return done(null, false, { message : 'User not verified '+username });
        hash(password, user.salt, function(err, hash){
            if(err) return done(err);
            if(hash == user.hash || password == user.hash+user.salt) {
                return done(null, user);
            }
            else {
                done(null, false, { message : 'Incorrect password ' });
            }
        });
    });
};

usersSchema.statics.getUserEmail = function(user_id, done) {
    this.findOne({"_id" : user_id}, function(err, user){
        if(err) throw err;
        if(!user) return false;
        done(user.email);
    });
};

// admin methods

usersSchema.statics.adminFindAll = function(req, done){
    var User = this, perPage = config.pagination.itemsPerPage, page = (req.query.page) ? req.query.page : 1;
    var find = {}, searchText = (req.query.search) ? req.query.search : false;

    if (searchText)
        find = {$or: [{username: {$regex : searchText}}, {email: {$regex : searchText}} ]};

    this.find(find,{salt: 0, hash: 0, hash_verify_account: 0}, {skip: (page-1)*perPage, limit: perPage}, function(err, users){
        if(err) throw err;

        User.count(find, function (err, count) {
            done({result: 1, page: page, pages: Math.ceil(count/perPage), users: users});
        });
    });
}

usersSchema.statics.adminFindOne = function(req, done){
    if (!req.query.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.findOne({"_id" : req.query.id},{},function(err, user){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!user) {
            done({result: 0, msg: "User not found."});
        }
        else {
            done({result: 1, user: user.toObject()});
        }
    });
}

usersSchema.statics.adminCreate = function(req, done){
    var User = this, data = req.body, filters = [];
    if (!data.username || !data.email || typeof data.status == 'undefined' || !data.language || !data.password) {
        done({result: 0, msg: "'status', 'username', 'email', 'language' and 'password' is required."});
        return;
    }
    this.findOne({"username" : data.username},{},function(err, user){
        if(err) throw err;
        if (user) {
            done({result: 0, msg: "Username already in use."});
        }
        else {
            User.findOne({"email" : data.email},{},function(err, user){
                if(err) throw err;
                if (user) {
                    done({result: 0, msg: "Email already in use."});
                }
                else {
                    filters = data.filters;

                    var Configurations = connection.model('Configurations');
                    Configurations.adminAddFilters(filters);

                    hash(data.password, function(err, salt, hash){
                        if(err) throw err;

                        User.create({
                            status : 1,
                            username: data.username,
                            email : data.email,
                            language : data.language,
                            salt : salt,
                            hash : hash,
                            roles: data.roles,
                            filters : filters
                        }, function(err, user){
                            if(err) throw err;

                            done({result: 1, msg: "User created", user: user.toObject()});
                        });
                    });
                }
            });
        }
    });
}

usersSchema.statics.adminEdit = function(req, done){
    var User = this, data = req.query, filters = [];
    if (!data.id || !data.username || typeof data.status == 'undefined' || !data.email || !data.language) {
        done({result: 0, msg: "'id', 'username', 'status', 'email' and 'language' is required."});
        return;
    }
    this.findOne({"username" : data.username, "_id": { $ne: data.id } },{},function(err, user){
        if(err) throw err;
        if (user) {
            done({result: 0, msg: "Username already in use."});
        }
        else {
            User.findOne({"email" : data.email, "_id": { $ne: data.id } },{},function(err, user){
                if(err) throw err;
                if (user) {
                    done({result: 0, msg: "Email already in use."});
                }
                else {
                    if (typeof data.filters === 'string') {
                        filters.push(JSON.parse(data.filters));
                    }
                    else {
                        for (var i in data.filters)
                            filters.push(JSON.parse(data.filters[i]));
                    }

                    var Configurations = connection.model('Configurations');
                    Configurations.adminAddFilters(filters);

                    if (data.password) {
                        hash(data.password, function(err, salt, hash){
                            if(err) throw err;

                            User.update({
                                "_id" : data.id
                            }, {
                                $set: {
                                    "username" : data.username,
                                    "status" : data.status,
                                    "email" : data.email,
                                    "language" : data.language,
                                    "salt" : salt,
                                    "hash" : hash,
                                    "roles" : data.roles,
                                    "filters" : filters
                                }
                            }, function (err, numAffected) {
                                if(err) throw err;

                                done({result: 1, msg: numAffected+" users updated."});
                            });
                        });
                    }
                    else {
                        User.update({
                            "_id" : data.id
                        }, {
                            $set: {
                                "username" : data.username,
                                "status" : data.status,
                                "email" : data.email,
                                "language" : data.language,
                                "roles" : data.roles,
                                "filters" : filters
                            }
                        }, function (err, numAffected) {
                            if(err) throw err;

                            done({result: 1, msg: numAffected+" users updated."});
                        });
                    }
                }
            });
        }
    });
}

usersSchema.statics.adminDelete = function(req, done){
    if (!req.params.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.remove({
        "_id" : req.params.id
    }, function (err, numAffected) {
        if(err) throw err;

        done({result: 1, msg: numAffected+" users deleted."});
    });
}

usersSchema.statics.adminSetStatus = function(req, done){
    var data = req.body;
    if (!data.id || typeof data.status == 'undefined') {
        done({result: 0, msg: "'id' and 'status' is required."});
        return;
    }
    this.update({
        "_id" : data.id
    }, {
        $set: {
            "status" : data.status
        }
    }, function (err, numAffected) {
        if(err) throw err;

        done({result: 1, msg: "Status updated.", id: data.id, status: data.status});
    });
}

var Users = connection.model('Users', usersSchema);
module.exports = Users;