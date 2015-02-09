var Loader = connection.model('Loader');

require('../../core/controller.js');

function LoaderController(model) {
    this.model = model;
    this.searchFields = [''];
}

LoaderController.inherits(Controller);

var controller = new LoaderController(Loader);

exports.LoaderUpload = function(req,res){
    if (!req.files.file) {
        res.send(201, {result: 0, msg: "'file' is required."});
        return;
    }
    var fs = require('fs'), mongoose = require('mongoose'), csv = require('csv');
    var file = req.files.file, fileId = mongoose.Types.ObjectId(), fileType = file.name.split(".");

    if (String(fileType[1]).toUpperCase() != 'CSV') {
        res.send(201, {result: 0, msg: "Invalid file type"});
        return;
    }

    csv()
        .from.path(file.path, { encoding: 'ascii' })
        .to.array( function(data){
            var fileData = data;
            getFilesConfiguration(function(result) {
                if (result.result == 0) {
                    res.send(201, result);
                    return;
                }
                var filesConfig =  result.filesConfig;

                if (filesConfig.filesSource == 0) { //Local
                    fs.readFile(file.path, function(err, data) {
                        var newPath = __dirname+"/../../../public/uploads/"+fileId+"."+fileType[1];
                        fs.writeFile(newPath, data, function (err) {
                            if(err) throw err;

                            Loader.create({
                                _id: fileId,
                                status: 0,
                                userID: req.user._id,
                                fileURL: config.url+"uploads/"+fileId+"."+fileType[1],
                                fileName: file.name,
                                fileSize: file.size,
                                fileData: fileData
                            }, function(err, file){
                                if(err) throw err;

                                res.send(201, {result: 1, msg: "File loaded", id: file._id, data: fileData.slice(0,10)});
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

                                Loader.create({
                                    _id: fileId,
                                    status: 0,
                                    userID: req.user._id,
                                    fileURL: 'https://s3.amazonaws.com/'+config.amazon.bucket+'/'+fileId+"."+fileType[1],
                                    fileName: file.name,
                                    fileSize: file.size,
                                    fileData: fileData
                                }, function(err, file){
                                    if(err) throw err;

                                    res.send(201, {result: 1, msg: "File loaded", id: file._id, data: fileData.slice(0,10)});
                                });
                            });
                        });
                    });
                }
            });
        })
        .on('error', function(error){
            res.send(201, {result: 0, msg: "ERROR loading the file"});
            return;
        });
};

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

exports.LoaderImport = function(req,res){
    var data = req.body;

    Loader.update({
        "_id" : data.id
    }, {
        $set: {
            "status" : 2,
            "fileFields" : data.fields
        }
    }, function (err, numAffected) {
        if(err) throw err;

        startLoad(data.id);

        res.send(201, {result: 1, msg: "Import loaded, you will receive an email when the process is complete."});
    });
};

/* LOADER */
var Employees = connection.model('Employees');
var Users = connection.model('Users');
var Positions = connection.model('Positions');
var Units = connection.model('Units');
var Brands = connection.model('Users');
var PositionCategories = connection.model('PositionCategories');
var PositionAreas = connection.model('PositionAreas');
var ProfessionalGroups = connection.model('ProfessionalGroups');

var crypto = require('crypto');
var hash = require('../../../util/hash');

var loadId = null;
var currentEmployee = null;
var loadLog = [];
var loadUser = null;

var employees = null;
var users = null;
var positions = null;
var units = null;
var brands = null;
var positionCategories = null;
var positionAreas = null;
var professionalGroups = null;

var idbrand = '';
var idposition = '';
var positionName = '';

function loadData(done) {
    Employees.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
        if(err) throw err;

        employees = data;

        Users.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
            if(err) throw err;

            users = data;

            Positions.find({nd_trash_deleted: {'$ne': true } },{},{}, function(err, data){
                if(err) throw err;

                positions = data;

                Units.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
                    if(err) throw err;

                    units = data;

                    Brands.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
                        if(err) throw err;

                        brands = data;

                        PositionAreas.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
                            if(err) throw err;

                            positionAreas = data;

                            PositionCategories.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
                                if(err) throw err;

                                positionCategories = data;

                                ProfessionalGroups.find({nd_trash_deleted: {'$ne': true }},{},{}, function(err, data){
                                    if(err) throw err;

                                    professionalGroups = data;

                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function startLoad(id) {
    loadId = id;
    loadLog = [];

    addLog('Starting data dump');

    Loader.findOne({"_id": loadId},{},function(err, load){
        if(err) throw err;

        load = load.toObject();

        Users.findOne({"_id" : load.userID},{},function(err, user){
            if(err) throw err;

            loadUser = user;

            var loadData = [];

            for (var i in load.fileData) {
                var row = String(load.fileData[i]).split(';'), rowObject = {};

                for (var j in load.fileFields) {
                    if (load.fileFields[j] != '') {
                        rowObject[load.fileFields[j]] = row[j];
                    }
                }

                loadData.push(rowObject);
            }

            console.log(loadData);

            addLog('Starting verification process');

            verify(loadData);
        });
    });
}

function verify(data) {
    var checkbirddate = true;
    var checkseniority = true;
    var checkstatus = true;
    var checkunit = true;
    var checkemail = true;
    var checkboss = true;
    var checkdocument = true;
    var checkposition = true;
    var checkname = true;
    var checkfilters = true;
    var filtersUpdated = 0;

    var NotfoundPositions = [];

    var found = 0;
    var notfound = 0;

    addLog('-------------EMPLOYEE VERIFICATION-------------------');

    employeeUpdate(data,0);
}

function newEmployee(field) {
    var employee = {};

    employee.employeeCode = field.iduser;
    employee.employeeName = field.name+' '+field.surname1+' '+field.surname2;

    employee.status = 'Active';

    if (field.evaluable == '' && field.outCause == '')
        employee.status = 'Temporary Leave';

    if (field.outCause != '')
        employee.status = 'Out of the Company';

    if (employee.status == 'Out of the Company')
        return;

    addLog('EMPLOYEE NOT FOUND: '+field.iduser+' UNIT: '+field.idunit);

    if (field.email != '') employee.emailAddress = field.email;

    employee.idunit = field.idunit;
    employee.dependsOnId = field.boss;
    employee.actualPosition = idposition;

    if (field.birthDateString != '') {
        var y =  String(field.birthDateString).substr(0, 4);
        var m =  String(field.birthDateString).substr(4, 2);
        var d =  String(field.birthDateString).substr(6, 2);

        employee.birthDate = new Date(y, m, d);
    }

    if (field.seniorityDateString != '') {
        var y =  String(field.seniorityDateString).substr(0, 4);
        var m =  String(field.seniorityDateString).substr(4, 2);
        var d =  String(field.seniorityDateString).substr(6, 2);

        employee.seniorityDate = new Date(y, m, d);
    }

    employee.sex = (field.sex == 1) ? 'Man' : 'Woman';

    employee.nd_trash_deleted = false;

    Employees.create(employee, function(err){
        if(err) throw err;
    });
}

function addLog(string) {
    loadLog.push(string);

    console.log(string);
}

function locate(field, value, data) {
    for (var i in data) {
        if (data[i][field] == value) {
            return data[i][field]
        }
    }

    return false;
}

function locateDocument(field, value, data) {
    for (var i in data) {
        if (data[i][field] == value) {
            return data[i]
        }
    }

    return false;
}

function sendEmail(emailSubject, emailMessage, emailTo) {
    var nodemailer = require("nodemailer");

    var transportSMTP = nodemailer.createTransport("SMTP", {
        host: config.smtp.host,
        secureConnection: config.smtp.secureConnection,
        port: config.smtp.port,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.password
        }
    });

    var mailOptions = {
        from: config.smtp.user,
        to: emailTo,
        subject: emailSubject,
        html: emailMessage
    };

    transportSMTP.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log(response);
        }

        transportSMTP.close(); // shut down the connection pool, no more messages
    });

}

function getPosition(fields)
{
    var idposition = '';
    var positionName = '';

    var professionalGroup = locateDocument('code', fields.idProfessionalGroup,  professionalGroups);
    if (professionalGroup != undefined)
        professionalGroupID = professionalGroup._id;

    var positionCategory = locateDocument('code', fields.idPositionCategory,  positionCategories);
    if (positionCategory != undefined)
        positionCategoryID = positionCategory._id;

    var positionArea = locateDocument('code', fields.idPositionArea,  positionAreas);
    if (positionArea != undefined)
        positionAreaID = positionArea._id;

    if (unit = locateDocument('unit', fields.idunit,  units)) {
        idbrand = unit.brand;
        fields.idbrand = unit.brand;

        if (fields.idProfessionalGroup == 'III' || fields.idProfessionalGroup == 'IV') {

            if (professionalGroupID != undefined &&  positionAreaID != undefined)
            {
                for (var p in positions) {
                    var position = positions[p];
                    if (position.positionBrand == idbrand && position.professionalGroup == professionalGroupID && position.positionArea == positionAreaID) {
                        idposition = position._id;
                        positionName = position.positionName;
                        break;
                    }
                }
            }

        } else {

            for (var p in positions) {
                var position = positions[p];
                if (position.positionBrand == idbrand && position.professionalGroup == professionalGroupID && position.positionCategory == positionCategoryID && position.positionArea == positionAreaID) {
                    idposition = position._id;
                    positionName = position.positionName;
                    break;
                }
            }
        }

        return idposition;
    }
}


function employeeUpdate(data, i)
{
    var fields = data[i];
    var checkbirddate = false;
    var checkseniority = false;
    var checkstatus = true;
    var checkunit = true;
    var checkemail = true;
    var checkboss = true;
    var checkdocument = true;
    var checkposition = true;
    var checkname = true;

    var found = 0;
    var notfound = 0;
    var changed = false;

    var idbrand = '';
    var idposition = '';
    var thePositionName = '';
    var professionalGroupID = undefined;
    var positionCategoryID = undefined;
    var positionAreaID = undefined;

    var professionalGroup = locateDocument('code', fields.idProfessionalGroup,  professionalGroups);
    if (professionalGroup != undefined)
        professionalGroupID = professionalGroup._id;

    var positionCategory = locateDocument('code', fields.idPositionCategory,  positionCategories);
    if (positionCategory != undefined)
        positionCategoryID = positionCategory._id;

    var positionArea = locateDocument('code', fields.idPositionArea,  positionAreas);
    if (positionArea != undefined)
        positionAreaID = positionArea._id;

    if (unit = locateDocument('unit', fields.idunit,  units)) {
        idbrand = unit.brand;
        fields.idbrand = unit.brand;

        if (fields.idProfessionalGroup == 'III' || fields.idProfessionalGroup == 'IV') {

            if (professionalGroupID != undefined &&  positionAreaID != undefined)
            {
                for (var p in positions) {
                    var position = positions[p];

                    if (position.positionBrand == idbrand && position.professionalGroup == professionalGroupID && position.positionArea == positionAreaID) {
                        idposition = position._id;
                        thePositionName = position.positionName;
                        break;
                    }
                }
            }

        } else {
            for (var p in positions) {
                var position = positions[p];

                if (position.positionBrand == idbrand && position.professionalGroup == professionalGroupID && position.positionCategory == positionCategoryID && position.positionArea == positionAreaID) {
                    idposition = position._id;
                    thePositionName = position.positionName;
                    break;
                }
            }
        }

        if (idposition == '')
            addLog('POSITION NOT FOUND FOR PROFESSIONAL GROUP: '+fields.idProfessionalGroup+' POSITION CATEGORY: '+fields.idPositionCategory+' POSITION AREA: '+fields.idPositionArea+' BRAND: '+idbrand);

    }
    else {
        addLog('Unit '+fields.idunit+' not found...');
    }

    var currentEmployee = null;

    if ((currentEmployee = locateDocument('employeeCode', data[i].iduser, employees)) == false && data[i].outDateString == '') {
        notfound++;
    } else if (currentEmployee) {
        found++;

        if (checkname) {
            if (String(fields.name).replace('-', '')+' '+String(fields.surname1).replace('-', '')+' '+String(fields.surname2).replace('-', '') != currentEmployee.employeeName) {
                addLog('CHANGE NAME: '+fields.iduser+' UNIT: '+fields.idunit+' OLD NAME= '+currentEmployee.employeeName+' NEW NAME = '+fields.name+' '+fields.surname1+' '+fields.surname2);
                currentEmployee.employeeName =  String(fields.name).replace('-', '')+' '+String(fields.surname1).replace('-', '')+' '+String(fields.surname2).replace('-', '');
                changed = true;
            }
        }

        if (checkposition)
        {
            if (idposition != '' && idposition != currentEmployee.payrollPosition) {
                addLog('CHANGE POSITION FOR USER: '+fields.iduser+' UNIT: '+fields.idunit+' OLD POSITION= '+currentEmployee.payrollPosition+' NEW POSITION = '+idposition);

                currentEmployee.payrollPosition = idposition;
                changed = true;

                currentEmployee.actualPosition = idposition;
                currentEmployee.actualPositionName = thePositionName;
                changed = true;
            }

            if (idposition != '' && idposition != currentEmployee.actualPosition) {
                addLog('SETTING POSITION FOR USER: '+fields.iduser+' UNIT: '+fields.idunit+": " +idposition);

                currentEmployee.actualPosition = idposition;
                currentEmployee.actualPositionName = thePositionName;
                changed = true;
            }

        }

        if (checkdocument) {
            if (fields.document != '' && fields.document != currentEmployee.idcardnbr) {
                addLog('CHANGE DOCUMENT: '+fields.iduser+' UNIT: '+fields.idunit);

                currentEmployee.idcardnbr = fields.document;
                changed = true;

            }
        }

        if (checkboss) {
            if (fields.boss != '' && fields.boss != currentEmployee.dependsOnId) {
                addLog('CHANGE DEPENDENCY: '+fields.iduser+' UNIT: '+fields.idunit+' OLD DEPENDENCY= '+currentEmployee.dependsOnId+' NEW DEPENDENCY = '+fields.boss);

                currentEmployee.dependsOnId = fields.boss;
                changed = true;

            }
        }

        if (checkemail) {
            if (fields.email != '' && fields.email != currentEmployee.emailAddress) {
                addLog('CHANGE EMAIL: '+fields.iduser+' UNIT: '+fields.idunit+' OLD EMAIL= '+currentEmployee.emailAddress+' NEW EMAIL = '+fields.email);

                currentEmployee.emailAddress = fields.email;
                changed = true;

            }
        }

        if (checkunit) {
            if (fields.idunit != '' && fields.idunit != currentEmployee.idunit) {
                addLog('CHANGE IDUNIT: '+fields.iduser+' UNIT: '+fields.idunit+' OLD UNIT= '+currentEmployee.idunit+' NEW UNIT = '+fields.idunit);

                currentEmployee.idunit = fields.idunit;
                changed = true;


            }
        }

        var employeestatus = 'Active';

        if (fields.outCause != '')
            employeestatus = 'Out of the Company';

        if (checkstatus) {
            if (employeestatus != currentEmployee.status) {
                addLog('CHANGE STATUS: '+fields.iduser+' UNIT: '+fields.idunit+' OLD STATUS= '+currentEmployee.status+' NEW STATUS = '+employeestatus);

                currentEmployee.status = employeestatus;
                changed = true;
            }
        }

        if (checkstatus) {
            if (fields.outCause != '' && fields.outCause != currentEmployee.outCompanyCause) {
                addLog('CHANGE OUT_COMPANY_CAUSE: '+fields.iduser+' UNIT: '+fields.idunit+' OLD OUT_COMPANY_CAUSE= '+currentEmployee.outCompanyCause+' NEW OUT_COMPANY_CAUSE = '+fields.outCause);

                currentEmployee.outCompanyCause = fields.outCause;
                changed = true;
            }
        }

        if (checkstatus) {
            if (fields.outDateString != '') {
                var y =  String(fields.outDateString).substr(0, 4);
                var m =  String(fields.outDateString).substr(4, 2);
                var d =  String(fields.outDateString).substr(6, 2);

                if (currentEmployee.outCompanyDate == '' || new Date(y, m, d) != currentEmployee.outCompanyDate) {
                    addLog('CHANGE OUT_COMPANY_DATE: '+fields.iduser+' UNIT: '+fields.idunit+' OLD OUT_COMPANY_DATE= '+currentEmployee.outCompanyDate+' NEW OUT_COMPANY_DATE = '+fields.outDateString);

                    currentEmployee.outCompanyDate = new Date(y, m, d);
                    changed = true;
                }
            }
        }

        if (checkbirddate) {
            if (fields.birdthDateString != '') {
                var y =  String(fields.birdthDateString).substr(0, 4);
                var m =  String(fields.birdthDateString).substr(4, 2);
                var d =  String(fields.birdthDateString).substr(6, 2);

                if (currentEmployee.birthDate == '' || new Date(y, m, d) != currentEmployee.birthDate) {
                    addLog('BIRTHDATE CHANGE');

                    currentEmployee.birthDate = new Date(y, m, d);
                    changed = true;
                }
            }
        }

        if (checkseniority) {
            if (fields.seniorityDateString != '') {
                var y =  String(fields.seniorityDateString).substr(0, 4);
                var m =  String(fields.seniorityDateString).substr(4, 2);
                var d =  String(fields.seniorityDateString).substr(6, 2);

                if (currentEmployee.seniorityDate == '' || new Date(y, m, d) != currentEmployee.seniorityDate) {
                    addLog('SENIORITYDATE CHANGE');
                    currentEmployee.seniorityDate = new Date(y, m, d);
                    changed = true;
                }
            }
        }

    }

    if (changed == true && currentEmployee)
    {

        if (currentEmployee.blockForLoad != true)
        {

            if (currentEmployee.history != undefined)
                currentEmployee.history = currentEmployee.history + new Date().toString() + ': Employee modified by sync process'+ String.fromCharCode(13);
            else
                currentEmployee.history =  new Date().toString() + ': Employee modified by sync process'+ String.fromCharCode(13);

            var upsertData = currentEmployee.toObject();


            delete(upsertData._id);

            Employees.update({
                "employeeCode" : fields.iduser
            }, {
                $set: upsertData
            }, function (err, numAffected) {
                if(err) throw err;

                if (numAffected>0)
                {
                    console.log("The employee "+ fields.iduser+" have been updated successfully.");
                } else {
                    console.log("Error updating the employee, the employee have not been updated!");
                }

                if (data[i+1])
                    process.nextTick(employeeUpdate(data,i+1));
                else {
                    addLog('GO TO USERS VERIFICATION ========================================================');
                    usersVerification(data,0);
                }
            });
        }  else {
            console.log('Employee '+fields.iduser+' blocked for update');
            if (data[i+1])
                process.nextTick(employeeUpdate(data,i+1));
            else {
                addLog('GO TO USERS VERIFICATION ========================================================');
                usersVerification(data,0);
            }
        }
    } else {
        if (data[i+1])
            process.nextTick(employeeUpdate(data,i+1));
        else {
            addLog('GO TO USERS VERIFICATION ========================================================');
            usersVerification(data,0);
        }
    }
}

function usersVerification(data,i)
{
    var fields = data[i];

    currentUser = locateDocument('username', fields.iduser, users);

    if (currentUser) {
        var currentEmployee = null;

        if ((currentEmployee = locateDocument('employeeCode', data[i].iduser, employees)) == false && data[i].outDateString == '') {
            addLog('DISABLE USER - EMPLOYEE NOT ACTIVE: '+fields.iduser+' UNIT: '+fields.idunit);

            Users.update({
                "username" : fields.iduser
            }, {
                $set: {
                    "status" : 0
                }
            }, function (err, numAffected) {
                if(err) throw err;

                if (data[i+1])
                    process.nextTick(usersVerification(data,i+1));
                else
                {
                    addLog('GO TO NEW USERS ========================================================');
                    newUsers(data,0);
                }
            });
        } else if (currentEmployee) {

            if (currentEmployee.blockForLoad != true)
            {
                var userFilters = [{name:'IDUNIT',value:fields.idunit},{name:'IDBRAND',value:fields.idbrand}];

                if (currentUser.filters != userFilters)
                {
                    Users.update({
                        "username" : fields.iduser
                    }, {
                        $set: {
                            "filters" : userFilters
                        }
                    }, function (err, numAffected) {
                        if(err) throw err;

                        if (data[i+1])
                            process.nextTick(usersVerification(data,i+1));
                        else
                        {
                            addLog('GO TO NEW USERS ========================================================');
                            newUsers(data,0);
                        }
                    });
                } else {
                    if (data[i+1])
                        process.nextTick(usersVerification(data,i+1));
                    else
                    {
                        addLog('GO TO NEW USERS ========================================================');
                        newUsers(data,0);
                    }
                }

            }  else {
                if (data[i+1])
                    process.nextTick(usersVerification(data,i+1));
                else
                {
                    addLog('GO TO NEW USERS ========================================================');
                    newUsers(data,0);
                }
            }
        } else {
            addLog('EMPLOYEE NOT FOUND: '+fields.iduser+' UNIT: '+fields.idunit);
            if (data[i+1])
                process.nextTick(usersVerification(data,i+1));
            else {
                addLog('GO TO NEW USERS ========================================================');
                newUsers(data,0);
            }
        }

    } else {
        addLog('USER NOT FOUND FOR EMPLOYEE: '+fields.iduser+' UNIT: '+fields.idunit);
        if (data[i+1])
            process.nextTick(usersVerification(data,i+1));
        else {
            addLog('GO TO NEW USERS ========================================================');
            newUsers(data,0);
        }
    }
}

function newUsers(data, i)
{
    var field = data[i];

    if (locate('username', field.iduser, users) == false && data[i].outDateString == '') {

        var user = {}, userFilters = [];
        var password = 'intalligent';

        addLog('USER NOT FOUND: '+field.iduser+' UNIT: '+field.idunit);

        user.name = field.name+' '+field.surname1+' '+field.surname2;
        user.status = 1;
        user.username = field.iduser;
        user.language = "es-ES";

        if (field.email != '') user.email = field.email;

        userFilters.push({name: 'IDUNIT', value: field.idunit});

        userFilters.push({name: 'IDBRAND', value: field.idbrand});

        user.filters = userFilters;
        user.roles = ["52988ad4df1fcbc201000009"];
        user.history = new Date().toString() + ': User created by sync process'+ String.fromCharCode(13);

        hash(password, function(err, salt, hash){
            if(err) {
                throw err;
                console.log(err);
            }

            user.salt = salt,
            user.hash = hash;

            Users.create(user, function(err, theUser){
                if(err) throw err;

                console.log('User Created: '+ theUser.username);
                if (data[i+1])
                    process.nextTick(newUsers(data,i+1));
                else {
                    addLog('GO TO NEW EMPLOYEES ========================================================');

                    newEmployees(data,0);
                }

            });
        });

    } else {
        if (data[i+1])
            process.nextTick(newUsers(data,i+1));
        else {
            addLog('GO TO NEW EMPLOYEES ========================================================');

            newEmployees(data,0);
        }
    }
}

function newEmployees(data,i) {
    var field = data[i];

    if (field && locate('employeeCode', data[i].iduser, employees) == false && data[i].outDateString == '') {

        var employee = {};

        employee.employeeCode = field.iduser;
        employee.employeeName = field.name+' '+field.surname1+' '+field.surname2;

        employee.status = 'Active';

        if (field.evaluable == '' && field.outCause == '')
            employee.status = 'Temporary Leave';

        if (field.outCause != '')
            employee.status = 'Out of the Company';

        if (employee.status == 'Out of the Company')
            return;

        addLog('EMPLOYEE NOT FOUND: '+field.iduser+' UNIT: '+field.idunit);

        if (field.email != '') employee.emailAddress = field.email;

        employee.idunit = field.idunit;
        employee.dependsOnId = field.boss;
        employee.actualPosition = idposition;
        employee.actualPositionName = positionName;
        employee.history = new Date().toString()+ ': Employee created by sync process'+ String.fromCharCode(13);

        if (field.birthDateString != '') {
            var y =  String(field.birthDateString).substr(0, 4);
            var m =  String(field.birthDateString).substr(4, 2);
            var d =  String(field.birthDateString).substr(6, 2);

            employee.birthDate = new Date(y, m, d);
        }

        if (field.seniorityDateString != '') {
            var y =  String(field.seniorityDateString).substr(0, 4);
            var m =  String(field.seniorityDateString).substr(4, 2);
            var d =  String(field.seniorityDateString).substr(6, 2);

            employee.seniorityDate = new Date(y, m, d);
        }

        employee.sex = (field.sex == 1) ? 'Man' : 'Woman';

        employee.nd_trash_deleted = false;

        Employees.create(employee, function(err){
            if(err) throw err;

            addLog('EMPLOYEE CREATED: '+field.iduser+' UNIT: '+field.idunit);

            if (data[i+1])
                process.nextTick(newEmployees(data,i+1));
            else {
                addLog('GO TO END PROCESS ========================================================');

                endProcess();
            }
        });

    } else {
        if (data[i+1])
            process.nextTick(newEmployees(data,i+1));
        else
        {
            addLog('GO TO out of company employees ========================================================');

            outOfCompanyEmployees(data,0);
        }
    }
}

function outOfCompanyEmployees(data,i) {
    var currentEmployee = employees[i];
    if (currentEmployee && locate('iduser', currentEmployee.employeeCode, data) == false) {
        //The employee is not in the load file... set up as out of company

        if (currentEmployee.blockForLoad != true && currentEmployee.status != 'Out of the Company')
        {
            currentEmployee.status = 'Out of the Company';
            currentEmployee.outCompanyDate =  Date.now();

            if (currentEmployee.history != undefined)
                currentEmployee.history = currentEmployee.history + new Date().toString() + ': Employee Out of company status by sync process'+ String.fromCharCode(13);
            else
                currentEmployee.history =  new Date().toString() + ': Employee Out of company status by sync process'+ String.fromCharCode(13);

            var upsertData = currentEmployee.toObject();

            delete(upsertData._id);

            Employees.update({
                "employeeCode" : currentEmployee.employeeCode
            }, {
                $set: upsertData
            }, function (err, numAffected) {
                if(err) throw err;

                if (numAffected>0)
                {
                    console.log("OUT OF THE COMPANY - The employee "+ currentEmployee.employeeCode+" have been updated successfully.");
                } else {
                    console.log("OUT OF THE COMPANY - Error updating the employee, the employee have not been updated!");
                }


                if (employees[i+1])
                    process.nextTick(outOfCompanyEmployees(data,i+1));
                else {
                    addLog('GO TO out of company users ========================================================');
                    outOfCompanyUsers(data,0);
                }
            });
        } else {
            if (employees[i+1])
                process.nextTick(outOfCompanyEmployees(data,i+1));
            else {
                addLog('GO TO out of company users ========================================================');
                outOfCompanyUsers(data,0);
            }
        }

    } else {
        //The employee is in the load file nothing to do...
        if (employees[i+1])
            process.nextTick(outOfCompanyEmployees(data,i+1));
        else {
            addLog('GO TO out of company users ========================================================');
            outOfCompanyUsers(data,0);
        }

    }
}

function outOfCompanyUsers(data,i) {
    var currentUser = users[i];
    if (currentUser && locate('iduser', currentUser.username, data) == false) {
        //The user is not in the load file... set up as out of company

        if (currentUser.roles[0] == "52988ad4df1fcbc201000009" &&  currentUser.status != 0)
        {
            currentUser.status = 0;
            currentUser.endDate = Date.now();

            if (currentUser.history != undefined)
                currentUser.history = currentUser.history + new Date().toString() + ': User deactivated by sync process'+ String.fromCharCode(13);
            else
                currentUser.history =  new Date().toString() + ': User deactivated by sync process'+ String.fromCharCode(13);

            var upsertData = currentUser.toObject();

            delete(upsertData._id);

            Users.update({
                "username" : currentUser.username
            }, {
                $set: upsertData
            }, function (err, numAffected) {
                if(err) throw err;

                if (numAffected>0)
                {
                    console.log("OUT OF THE COMPANY - The user "+ currentUser.username+" have been updated successfully.");
                } else {
                    console.log("OUT OF THE COMPANY - Error updating the user, the user have not been updated!");
                }

                if (users[i+1])
                    process.nextTick(outOfCompanyUsers(data,i+1));
                else {
                    addLog('GO TO END PROCESS ========================================================');
                    endProcess();
                }
            });
        } else {
            if (users[i+1])
                process.nextTick(outOfCompanyUsers(data,i+1));
            else {
                addLog('GO TO END PROCESS ========================================================');
                endProcess();
            }
        }

    } else {
        //The employee is in the load file nothing to do...
        if (users[i+1])
            process.nextTick(outOfCompanyUsers(data,i+1));
        else {
            addLog('GO TO END PROCESS ========================================================');
            endProcess();
        }
    }
}

function endProcess()
{
    Loader.update({
        "_id" : loadId
    }, {
        $set: {
            "loadLog" : loadLog,
            "status" : 3
        }
    }, function (err, numAffected) {
        if(err) throw err;
        sendEmail('Loading process completed', loadLog.toString(), loadUser.email);
    });
}