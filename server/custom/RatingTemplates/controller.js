var RatingTemplates = connection.model('RatingTemplates');

require('../../core/controller.js');

function RatingTemplatesController(model) {
    this.model = model;
    this.searchFields = ['ratingTemplateName', 'ratingTemplateDescription'];
}

RatingTemplatesController.inherits(Controller);

var controller = new RatingTemplatesController(RatingTemplates);

exports.RatingTemplatesFindAll = function(req,res){
    req.query.fields = '{"_id":1,"ratingTemplateName":1,"ratingTemplateDescription":1,"ratings":1}';
    req.query.trash = true;

    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.RatingTemplatesFindOne = function(req,res){
    req.query.trash = true;

    controller.findOne(req, function(result){
        res.send(201, result);
    });
};

exports.RatingTemplatesCreate = function(req,res){
    req.query.trash = true;

    if (!RatingTemplates.validateRatingTemplate(req.body)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    controller.create(req, function(result){
        res.send(201, result);
    });
};

exports.RatingTemplatesUpdate = function(req,res){
    req.query.trash = true;

    var data = req.body, id = data._id;

    if (!RatingTemplates.validateRatingTemplate(data)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    delete(data.id);
    delete(data._id);

    if (data.ratings) {
        for (var i in data.ratings) {
            data.ratings[i]['ratingOrder'] = i;
        }
    }

    RatingTemplates.update({
        "_id" : id
    }, {
        $set: data
    }, function (err, numAffected) {
        if(err) throw err;

        res.send(201,{result: 1, msg: numAffected+" items updated."});
    });
};

exports.RatingTemplatesDelete = function(req,res){
    var data = req.body;

    req.query.trash = true;

    data.nd_trash_deleted = true;
    data.nd_trash_deleted_date = new Date();

    controller.update(req, function(result){
        res.send(201, result);
    });
};