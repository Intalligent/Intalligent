var Languages = connection.model('Languages');

/* LANGUAGES */
exports.languagesGetTranslations = function(req,res){
    var lookFor = (req.query.hasOwnProperty('id')) ? 'id' : 'language';
    var lookForValue = (req.query.hasOwnProperty('id')) ? req.query.id : req.query.language;
    Languages.getTranslations(lookFor, lookForValue, function(result){
        res.send(201, result);
    });
};
exports.languagesSaveTranslation = function(req,res){
    Languages.saveTranslation(req.body.translation, function(result){
        res.send(201, result);
    });
};

exports.adminLanguagesSaveTranslations = function(req,res){
    Languages.adminSaveTranslations(req.body.id, req.body.data, function(result){
        res.send(201, result);
    });
};

require('../core/controller.js');

function LanguagesController(model) {
    this.model = model;
    this.searchFields = ['description'];
}

LanguagesController.inherits(Controller);

var controller = new LanguagesController(Languages);

exports.adminLanguagesFindAll = function(req,res){
    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.adminLanguagesFindOne = function(req,res){
    controller.findOne(req, function(result){
        res.send(201, result);
    });
};