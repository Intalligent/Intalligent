require('./prototype.js');

function Controller(model) {
    this.model = model;

    //this.searchFields = ['name'];
}

Controller.method('findAll', function (req, done) {
    var Model = this.model, perPage = config.pagination.itemsPerPage, page = (req.query.page) ? req.query.page : 1;
    var find = {}, searchText = (req.query.search) ? req.query.search : false;
    var fieldsToGet = {},  fieldsToGetText = (req.query.fields) ? req.query.fields : false;

    var params = (req.query.page) ? {skip: (page-1)*perPage, limit: perPage} : {};

    if (req.query.sort) {
        var sortField = {};

        sortField[req.query.sort] = (req.query.sortType) ? req.query.sortType : 1;

        params['sort'] = sortField;
    }

    if (fieldsToGetText) {
        fieldsToGet = JSON.parse(fieldsToGetText);
    }

    var mandatoryFilters = [];

    if (req.query.trash == true)
    {
        var trashField = {}
        trashField['nd_trash_deleted'] = false;

        mandatoryFilters.push(trashField);
    }

    if (req.query.userid == true)
    {
        var userField = {}
        userField[user_id] = req.user._id;

        mandatoryFilters.push(userField);
    }

    if (req.query.find)
    {
        for (var i in req.query.find)
            mandatoryFilters.push(req.query.find[i]);
    }

    var searchFind = {}

    if (searchText) {

        var findFields = [];
        var searchFields = this.searchFields;

        for (var i in searchFields) {
            var thisField = {};

            //thisField[searchFields[i]] = {$regex : searchText};
            thisField[searchFields[i]] = new RegExp(searchText, "i"); //"i" is for case-insensitive

            findFields.push(thisField);
        }
        searchFind =  (findFields.length > 0) ? {$or: findFields} : {};
    }

    if (searchFind != {})
        mandatoryFilters.push(searchFind);

    if (mandatoryFilters != [])
        find =  {$and: mandatoryFilters};

    Model.find(find,fieldsToGet, params, function(err, items){
        if(err) throw err;

        Model.count(find, function (err, count) {
            done({result: 1, page: page, pages: ((req.query.page) ? Math.ceil(count/perPage) : 1), items: items});
        });
    });
});

Controller.method('findOne', function (req, done) {
    if (!req.query.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }

    var find = generateFindFields(req, req.query.id);

    //this.model.findOne({"_id" : req.query.id},{},function(err, item){
    this.model.findOne(find,{},function(err, item){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!item) {
            done({result: 0, msg: "Item not found."});
        }
        else {
            done({result: 1, item: item.toObject()});
        }
    });
});


Controller.method('findOneForServer', function (req, done) {
    if (!req.query.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }

    var find = generateFindFields(req, req.query.id);



    //this.model.findOne({"_id" : req.query.id},{},function(err, item){
    this.model.findOne(find,{},function(err, item){
        //if(err) throw err; Si no encuentra el id salta el error?
        if (!item) {
            done({result: 0, msg: "Item not found."});
        }
        else {
            done({result: 1, item: item});
        }
    });
});

Controller.method('create', function (req, done) {
    var data = req.body;

    if (req.query.userid == true)
    {
        data.user_id = (req.isAuthenticated()) ? req.user.id : null;
    }

    if (req.query.trash == true)
    {
        data.nd_trash_deleted = false;
    }


    this.model.create(data, function(err, item){
        if(err) throw err;

        done({result: 1, msg: "Item created", item: item.toObject()});
    });
});


Controller.method('update', function (req, done) {
    var data = req.body, id = data._id;

    var find = generateFindFields(req, id);

    delete(data.id);
    delete(data._id);

    if (req.query.userid == true)
    {
        data.user_id = (req.isAuthenticated()) ? req.user.id : null;
    }

    this.model.update(find, {$set: data }, function (err, numAffected) {
        if(err) throw err;

        if (numAffected>0)
        {
            done({result: 1, msg: numAffected+" items updated."});
        } else {
            done({result: 0, msg: "Error updating items, no item have been updated"});
        }
    });
});

Controller.method('remove', function (req, done) {
    if (!req.params.id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }

    var find = generateFindFields(req, req.params.id);

    //this.model.remove({"_id" : req.params.id}, function (err, numAffected) {
    console.log(find);
    this.model.remove(find, function (err, numAffected) {
        if(err) throw err;

        if (numAffected>0)
        {
            done({result: 1, msg: numAffected+" items deleted."});
        } else {
            done({result: 0, msg: "Error deleting items, no item have been deleted"});
        }
    });
});

function generateFindFields(req, id)
{
    var mandatoryFilters = [];
    var idField = {}
    idField['_id'] = id;

    mandatoryFilters.push(idField);

    if (req.query.trash == true)
    {
        var trashField = {}
        trashField['nd_trash_deleted'] = false;

        mandatoryFilters.push(trashField);
    }

    if (req.query.userid == true)
    {
        var userField = {}
        userField[user_id] = req.user._id;

        mandatoryFilters.push(userField);
    }

    return  {"$and": mandatoryFilters};

}

global.Controller = Controller;