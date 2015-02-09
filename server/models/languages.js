var mongoose = require('mongoose');

var languagesSchema = new mongoose.Schema({
    language: String,
    description: String,
    translations: []
}, { collection: config.app.collectionsPrefix+'languages' })

// other virtual / static methods added to schema

languagesSchema.statics.getTranslations = function(lookFor, lookForValue, done){
    var Language = this;
    var find = (lookFor == 'id') ? {"_id": lookForValue} : {"language": lookForValue};

    this.findOne(find,{},function(err, language){
        if(err) throw err;
        if (language) {
            Language.findOne({language: 'base'},{},function(err, base){
                if(err) throw err;
                if (base) {
                    if (!language.translations) language.translations = [];
                    //Recorre todas las etiquetas base, si no las encuentra en el idioma seleccionado, las añade
                    for (var i in base.toObject().translations) {
                        var found = false;
                        for (var j in language.toObject().translations) {
                            if (base.translations[i] == language.translations[j].base) {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            language.translations.push({base: base.translations[i]});
                    }

                    done({result: 1, translations: language.translations});
                }
                else {
                    done({result: 0, msg: "Base Language not found."});
                }
            });
        }
        else {
            done({result: 0, msg: "Language not found."});
        }
    });
}

languagesSchema.statics.getServerTranslations = function(done){
    this.find({},{},function(err, languages){
        if(err) throw err;
        done({result: 1, languages: languages});
    });
}

// admin methods

languagesSchema.statics.adminSaveTranslations = function(id, data, done){
    if (!id) {
        done({result: 0, msg: "'id' is required."});
        return;
    }
    this.update({
        "_id" : id
    }, {
        $set: {
            "translations" : data.translations
        }
    }, function (err, numAffected) {
        if(err) throw err;

        done({result: 1, msg: numAffected+" languages updated."});
    });
}

var Languages = connection.model('Languages', languagesSchema);
module.exports = Languages;