/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index');
};

exports.install = function(req, res){
    res.render('install');
};

exports.login = function(req, res){
    res.render('login');
};

exports.webapp = function(req, res){
    res.render('webapp');
};

exports.partial = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.controllerPartial = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('partials/'+controller+'/'+name);
};

exports.controllerCustomPartial = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('partials/custom/'+controller+'/'+name);
};

exports.adminview = function (req, res) {
    var controller = req.params.controller;
    var name = req.params.name;
    res.render('admin/'+controller+'/'+name);
};