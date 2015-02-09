var mongoose = require('mongoose');

var filesSchema = new mongoose.Schema({
    user_id: String,
    source: Number,
    type: String,
    name: String,
    extension: String,
    size: String,
    url: String,
    description: String,
    upload_user_id: String,
    created: { type: Date, default: Date.now }
}, { collection: config.app.collectionsPrefix+'files' })

// other virtual / static methods added to schema

filesSchema.statics.getFiles = function(req, done){
    var Files = this;

    getFilesConfiguration(function(result) {
        var filesConfig =  result.filesConfig;
        console.log(req.user);
        var find = {"source" : filesConfig.filesSource, "type" : new RegExp('image', "i"), "user_id" : req.user._id};

        if (req.query.format) {
            find['extension'] = req.query.format;
        }

        Files.find(find, {}, {sort: {created: -1}}, function(err, files){
            if(err) throw err;

            done({result: 1, files: files});
        });
    });
}

filesSchema.statics.upload = function(req, done){
    if (!req.files.file) {
        done({result: 0, msg: "'file' is required."});
        return;
    }
    var Files = this, fs = require('fs');
    var file = req.files.file, fileId = mongoose.Types.ObjectId(), fileType = file.name.split(".");

    getFilesConfiguration(function(result) {
        if (result.result == 0) {
            done(result);
            return;
        }
        var filesConfig =  result.filesConfig;

        if (filesConfig.filesSource == 0) { //Local
            fs.readFile(file.path, function(err, data) {
                var newPath = __dirname+"/../../public/uploads/"+fileId+"."+fileType[1];
                fs.writeFile(newPath, data, function (err) {
                    if(err) throw err;

                    Files.create({
                        _id: fileId,
                        user_id: req.user._id,
                        source: 0,
                        name: file.name,
                        extension: fileType[1],
                        type: file.type,
                        size: file.size,
                        url: config.url+"uploads/"+fileId+"."+fileType[1],
                        upload_user_id: req.user._id
                    }, function(err, file){
                        if(err) throw err;

                        done({result: 1, msg: "File uploaded", file: file.toObject()});
                    });
                });
            });
        }
        else if (filesConfig.filesSource == 1) { //Amazon http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!AWS/S3.html
            var AWS = require('aws-sdk');

            AWS.config.update({accessKeyId: filesConfig.amazonAccessKeyId, secretAccessKey: filesConfig.amazonSecretAccessKey, region: config.amazon.region});

            var s3 = new AWS.S3();

            s3.createBucket({Bucket: config.amazon.bucket}, function() {

                fs.readFile(file.path, function(err, data) {
                    params = {Bucket: config.amazon.bucket, Key: fileId+'.'+fileType[1], Body: data, ACL: "public-read", ContentType: file.type};

                    s3.putObject(params, function(err) {
                        if(err) throw err;

                        Files.create({
                            _id: fileId,
                            user_id: req.user._id,
                            source: 1,
                            name: file.name,
                            extension: fileType[1],
                            type: file.type,
                            size: file.size,
                            url: 'https://s3.amazonaws.com/'+config.amazon.bucket+'/'+fileId+"."+fileType[1],
                            upload_user_id: req.user._id
                        }, function(err, file){
                            if(err) throw err;

                            done({result: 1, msg: "File uploaded", file: file.toObject()});
                        });
                    });
                });
            });
        }
    });
}

// admin methods

filesSchema.statics.adminFindAll = function(req, done){
    var Files = this, perPage = config.pagination.itemsPerPage, page = (req.query.page) ? req.query.page : 1;
    var find = {}, searchText = (req.query.search) ? req.query.search : false;

    if (searchText)
        find = {$or: [{name: {$regex : searchText}}, {description: {$regex : searchText}} ]};

    getFilesConfiguration(function(result) {
        var filesConfig =  result.filesConfig;

        find.source = filesConfig.filesSource;

        Files.find(find,{}, {skip: (page-1)*perPage, limit: perPage}, function(err, files){
            if(err) throw err;

            Files.count(find, function (err, count) {
                done({result: 1, page: page, pages: Math.ceil(count/perPage), files: files});
            });
        });

    });
}

filesSchema.statics.adminFindOne = function(req, done){
    if (!req.query.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.findOne({"_id" : req.query.id},{},function(err, file){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!file) {
            done({result: 0, msg: "File not found."});
        }
        else {
            done({result: 1, file: file.toObject()});
        }
    });
}

function getFilesConfiguration(done) {
    var Configurations = connection.model('Configurations');
    var filesConfig = {};

    Configurations.getConfiguration('files-source', function(configuration){
        filesConfig.filesSource = configuration.value;

        if (configuration.value == 0) {
            done({result: 1, filesConfig: filesConfig});
        }
        else {
            Configurations.getConfiguration('amazon-access-key-id', function(configuration){
                if (!configuration.value) {
                    done({result: 0, msg: "amazonAccessKeyId not defined"});
                }
                else {
                    filesConfig.amazonAccessKeyId = configuration.value;

                    Configurations.getConfiguration('amazon-secret-access-key', function(configuration){
                        if (!configuration.value) {
                            done({result: 0, msg: "amazonSecretAccessKey not defined"});
                        }
                        else {
                            filesConfig.amazonSecretAccessKey = configuration.value;

                            done({result: 1, filesConfig: filesConfig});
                        }
                    });
                }
            });
        }
    });
}

filesSchema.statics.adminUpload = function(req, done){
    if (!req.files.file) {
        done({result: 0, msg: "'file' is required."});
        return;
    }
    var Files = this, fs = require('fs');
    var file = req.files.file, fileId = mongoose.Types.ObjectId(), fileType = file.name.split(".");

    getFilesConfiguration(function(result) {
        if (result.result == 0) {
            done(result);
            return;
        }
        var filesConfig =  result.filesConfig;

        if (filesConfig.filesSource == 0) { //Local
            fs.readFile(file.path, function(err, data) {
                var newPath = __dirname+"/../../public/uploads/"+fileId+"."+fileType[1];
                fs.writeFile(newPath, data, function (err) {
                    if(err) throw err;

                    Files.create({
                        _id: fileId,
                        source: 0,
                        name: file.name,
                        extension: fileType[1],
                        type: file.type,
                        size: file.size,
                        url: config.url+"uploads/"+fileId+"."+fileType[1],
                        upload_user_id: req.user._id
                    }, function(err, file){
                        if(err) throw err;

                        done({result: 1, msg: "File uploaded", file: file.toObject()});
                    });
                });
            });
        }
        else if (filesConfig.filesSource == 1) { //Amazon http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!AWS/S3.html
            var AWS = require('aws-sdk');

            AWS.config.update({accessKeyId: filesConfig.amazonAccessKeyId, secretAccessKey: filesConfig.amazonSecretAccessKey, region: config.amazon.region});

            var s3 = new AWS.S3();

            s3.createBucket({Bucket: config.amazon.bucket}, function() {

                fs.readFile(file.path, function(err, data) {
                    params = {Bucket: config.amazon.bucket, Key: fileId+'.'+fileType[1], Body: data, ACL: "public-read", ContentType: file.type};

                    s3.putObject(params, function(err) {
                        if(err) throw err;

                        Files.create({
                            _id: fileId,
                            source: 1,
                            name: file.name,
                            extension: fileType[1],
                            type: file.type,
                            size: file.size,
                            url: 'https://s3.amazonaws.com/'+config.amazon.bucket+'/'+fileId+"."+fileType[1],
                            upload_user_id: req.user._id
                        }, function(err, file){
                            if(err) throw err;

                            done({result: 1, msg: "File uploaded", file: file.toObject()});
                        });
                    });
                });
            });
        }
    });
}

filesSchema.statics.adminEdit = function(req, done){
    var Files = this, data = req.query;
    if (!data.id || !data.description) {
        done({result: 0, msg: "'id' and 'description' is required."});
        return;
    }
    this.findOne({"description" : data.description, "_id": { $ne: data.id }},{},function(err, file){
        if(err) throw err;
        if (file) {
            done({result: 0, msg: "Description already in use."});
        }
        else {
            Files.update({
                "_id" : data.id
            }, {
                $set: {
                    "description" : data.description
                }
            }, function (err, numAffected) {
                if(err) throw err;

                done({result: 1, msg: numAffected+" files updated."});
            });
        }
    });
}

filesSchema.statics.adminDelete = function(req, done){
    if (!req.params.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    var Files = this, fs = require('fs');

    this.findOne({"_id" : req.params.id},{},function(err, file){
        if (!file) {
            done({result: 0, msg: "File not found."});
        }
        else {
            getFilesConfiguration(function(result) {
                if (result.result == 0) {
                    done(result);
                    return;
                }
                var filesConfig =  result.filesConfig;

                if (filesConfig.filesSource == 0) { //Local
                    Files.remove({
                        "_id" : file._id
                    }, function (err, numAffected) {
                        if(err) throw err;

                        fs.unlink(__dirname+"/../../public/uploads/"+file._id+"."+file.extension, function (err) {
                            if (err) throw err;

                            done({result: 1, msg: numAffected+" files deleted."});
                        });
                    });
                }
                else if (filesConfig.filesSource == 1) { //Amazon http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!AWS/S3.html
                    var AWS = require('aws-sdk');

                    AWS.config.update({accessKeyId: filesConfig.amazonAccessKeyId, secretAccessKey: filesConfig.amazonSecretAccessKey, region: config.amazon.region});

                    var s3 = new AWS.S3();

                    Files.remove({
                        "_id" : file._id
                    }, function (err, numAffected) {
                        if(err) throw err;

                        var params = {Bucket: config.amazon.bucket, Key: file._id+"."+file.extension};
                        s3.deleteObject(params, function(err) {
                            if (err) throw err;

                            done({result: 1, msg: numAffected+" files deleted."});
                        });
                    });
                }
            });
        }
    });
}

var Files = connection.model('Files', filesSchema);
module.exports = Files;