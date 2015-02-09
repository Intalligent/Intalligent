/*
 * Serve JSON to our AngularJS client
 */

exports.getInitData = function(req,res){
    var language = (typeof req.user != 'undefined' && req.user.language) ? req.user.language : 'base';

    var Languages = connection.model('Languages');

    Languages.getTranslations('language', language, function(result){
        var translations = result.translations;

        var Configurations = connection.model('Configurations');

        Configurations.getConfigurations(function(result){
            var configurations = result.configurations;

            res.send(201, {user: ((req.user != undefined) ? req.user : {}), translations: translations, configurations: configurations });
        });
    });
};