var mongoose = require('mongoose');

var EmployeesSchema = new mongoose.Schema({
    employeeName: String,
    employeeCode: String,
    employeeImage: String,
    blockForLoad: Boolean,
    idunit: String,
    idbrand: String,
    idcardnbr: String,
    sex: String,
    actualPosition: String,
    actualPositionName: String,
    payrollPosition: String,
    status: String, //Active, Temporary Leave, Out of the Company
    actualDepartment: String,
    educationLevel: String,
    dependsOnId: String,
    dependsOnName: String,
    birthDate: Date,
    seniorityDate: Date,
    civilStatus: String,
    nationality: String,
    phone: String,
    mobilePhone: String,
    emailAddress: String,
    outCompanyCause: String,
    outCompanyDate: Date,
    numberOfEvaluations: String,
    lastEvaluationDate: String,
    numberOfPersonalityAppraisals: String,
    lastPersonalityAppraisalDate: String,
    topPerformerRating: Number,
    topPerformerRatingEvolution: String,
    topPerformerFork: String,
    topPerformerForkDescription: String,
    topPerformerRatingDate: Date,
    topPerformerAutoRating: String,
    topPerformerAutoRatingEvolution: String,
    topPerformerAutoFork: String,
    topPerformerAutoForkDescription: String,
    topPerformerAutoRatingDate: Date,
    topPerformerPersonalityRating: String,
    topPerformerPersonalityRatingEvolution: String,
    topPerformerPersonalityFork: String,
    topPerformerPersonalityForkDescription: String,
    topPerformerPersonalityRatingDate: Date,
    rankings: [],
    personalityAppraisal: [],
    topPerformerHistory: [],
    lastLoadId: String,
    nd_trash_deleted:{type: Boolean},
    nd_trash_deleted_date: {type: Date}
}, { collection: config.app.customCollectionsPrefix+'Employees' })

EmployeesSchema.statics.validateEmployee = function(employee){
    if (typeof employee.employeeCode == 'undefined')
        return false;
    if (employee.employeeCode === '')
        return false;
    if (typeof employee.employeeName == 'undefined')
        return false;
    if (employee.employeeName === '')
        return false;
    if (typeof employee.status == 'undefined')
        return false;
    if (employee.status === '')
        return false;

    return true;
}

EmployeesSchema.statics.upload = function(req, done){
    if (!req.files.file) {
        done({result: 0, msg: "'file' is required."});
        return;
    }
    var Employees = this, fs = require('fs');
    var Files = connection.model('Files');

    getFilesConfiguration(function(result) {
        if (result.result == 0) {
            done(result);
            return;
        }
        var filesConfig =  result.filesConfig;

        Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
            if(err) throw err;

            var file = req.files.file, fileId = employee._id, fileType = file.type.split("\/");

            if (employee) {
                if (filesConfig.filesSource == 0) { //Local
                    var uploadsPath = __dirname+"/../../../public/uploads/Employees";
                    fs.mkdir(uploadsPath, function(err) {
                        if(err && err.code != 'EEXIST') throw err;
                        fs.readFile(file.path, function(err, data) {
                            var newPath = uploadsPath+"/"+fileId+"."+fileType[1];
                            //var newPath = __dirname+"/../../public/uploads/"+fileId+"."+fileType[1];
                            fs.writeFile(newPath, data, function (err) {
                                if(err) throw err;

                                var file = {url: config.url+"uploads/Employees/"+fileId+"."+fileType[1]};

                                Employees.update({
                                    "_id" : employee._id
                                }, {
                                    $set: {
                                        "employeeImage" : file.url
                                    }
                                }, function (err) {
                                    if(err) throw err;

                                    done({result: 1, msg: "File uploaded", file: file});
                                });
                            });
                        });
                    });
                }
                else if (filesConfig.filesSource == 1) { //Amazon http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!AWS/S3.html
                    var AWS = require('aws-sdk');

                    AWS.config.update({accessKeyId: filesConfig.amazonAccessKeyId, secretAccessKey: filesConfig.amazonSecretAccessKey, region: config.amazon.region});

                    var s3 = new AWS.S3();
                    var uploadsFolder = "Employees";

                    s3.createBucket({Bucket: config.amazon.bucket}, function() {

                        fs.readFile(file.path, function(err, data) {
                            params = {Bucket: config.amazon.bucket, Key: uploadsFolder+fileId+'.'+fileType[1], Body: data, ACL: "public-read", ContentType: file.type};

                            s3.putObject(params, function(err) {
                                if(err) throw err;

                                Files.create({
                                    _id: fileId,
                                    source: 1,
                                    name: file.name,
                                    extension: fileType[1],
                                    type: fileType[0],
                                    size: file.size,
                                    url: 'https://s3.amazonaws.com/'+config.amazon.bucket+'/Employees'+fileId+"."+fileType[1],
                                    upload_user_id: req.user.id
                                }, function(err, file){
                                    if(err) throw err;

                                    done({result: 1, msg: "File uploaded", file: file.toObject()});
                                });
                            });
                        });
                    });
                }
            }
            else {
                done({result: 0, msg: 'Employee not found'});
            }
        });
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

var Employees = connection.model('Employees', EmployeesSchema);
module.exports = Employees;